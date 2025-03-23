"use server";

import { getUser } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import type { BookingValues, DifficultyValues } from "@/lib/validations";
import type { Problem } from "@prisma/client";
import { sample } from "lodash";

class OverdueFeedbackError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

export async function getValidTimes(date: Date) {
  const session = await getUser();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        equals: date,
      },
      OR: [{ user1Id: session.user?.id }, { user2Id: session.user?.id }],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  const isTimeSlotAvailable = (startTime: string) => {
    return !bookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(bookingStart.getTime() + 75 * 60000);

      const slotStart = new Date(startTime);
      const slotEnd = new Date(slotStart.getTime() + 75 * 60000);

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  };

  const timeSlots = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(7, 0, 0, 0);

  for (let i = 0; i < 18; i++) {
    // 7:00 - 10:30
    const slot = new Date(startOfDay.getTime() + i * 75 * 60000);
    if (isTimeSlotAvailable(slot.toISOString())) {
      timeSlots.push(slot);
    }
  }

  return timeSlots;
}

export async function checkPendingFeedbacks(userId: string) {

  const pendingBookings = await prisma.booking.findMany({
    where: {
      AND: [
        {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        },
        {
          status: "COMPLETED"
        },
      ]
    },
    include: {
      user1: true,
      user2: true,
      feedbacks: true
    }
  })

  const pendingFeedbacks = pendingBookings.filter(booking => booking.feedbacks.length < 2).map(booking => {
    const { feedbacks } = booking;
    const feedback = feedbacks.filter(f => f.feedbackProviderId !== userId);

    if (feedback.length > 0) {
      const bookingDate = new Date(booking.date);
      const daysSinceBooking = Math.floor((new Date().getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        bookingId: booking.id,
        otherUserName: booking.user1Id === userId ? booking.user2?.name : booking.user1?.name,
        daysSinceBooking,
        isOverdue: daysSinceBooking > 3
      }
    }
  }).filter(f => Boolean(f))

  return pendingFeedbacks;


  // const pendingFeedbacks = pendingBookings.map(booking => {
  //   const feedback = booking.feedbacks.filter(f => f.userId === userId);
  //   console.log(feedback)

  //   if (feedback) {
  //     const isUser1 = booking.user1Id === userId;
  //     const otherUser = isUser1 ? booking.user2 : booking.user1;
  //     const bookingDate = new Date(booking.date);
  //     const daysSinceBooking = Math.floor((new Date().getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));

  //     return {
  //       bookingId: booking.id,
  //       otherUserName: otherUser?.name || "Unknown User",
  //       daysSinceBooking,
  //       isOverdue: daysSinceBooking > 3
  //     }
  //   }
  // })


  // return pendingFeedbacks;
}

export async function createBooking(values: BookingValues) {
  const session = await getUser();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const { user } = session;

  // Check for pending feedbacks
  const pendingFeedbacks = await checkPendingFeedbacks(user.id);

  if (pendingFeedbacks.length > 0) {
    const overdueFeedbacks = pendingFeedbacks.filter(f => f?.isOverdue);
    const warningMessage = overdueFeedbacks.length > 0
      ? `You have ${overdueFeedbacks.length} overdue feedback(s) that are more than 3 days old. Please complete them before booking new sessions.`
      : `You have ${pendingFeedbacks.length} pending feedback(s). Please complete them before booking new sessions.`;

    throw new OverdueFeedbackError(warningMessage, "OVERDUE_FEEDBACK");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      date: values.date,
      startTime: values.startTime,
      status: "PENDING",
      user2Id: null,
      user1Id: {
        not: user.id,
      },
    },
  });

  if (!bookings.length) {
    const booking = await prisma.booking.create({
      data: {
        date: values.date,
        startTime: values.startTime,
        user1Id: user.id ? user.id : "", // TODO : fix this
        difficulty: values.difficulty,
        status: "PENDING",
      },
    });
    return booking.id;
  }

  // GET problem
  const problem1 = await getValidRandomProblem(bookings[0].difficulty);
  const problem2 = await getValidRandomProblem(values.difficulty);

  const booking = await prisma.booking.update({
    where: {
      id: bookings[0].id,
    },
    data: {
      user2Id: user.id,
      problem1Id: problem1?.titleSlug,
      problem2Id: problem2?.titleSlug,
      status: "ACCEPTED",
    },
  });

  return booking.id;
}

async function getValidRandomProblem(
  difficulty: DifficultyValues
): Promise<Problem> {
  let problems: Problem[] = [];
  switch (difficulty) {
    case "NOVICE":
      problems = await prisma.problem.findMany({
        where: {
          difficulty: "Easy",
        },
      });
      break;
    case "INTERMEDIATE":
      problems = await prisma.problem.findMany({
        where: {
          OR: [
            {
              difficulty: "Easy",
              acRate: {
                lte: 40,
              },
            },
            {
              difficulty: "Medium",
              acRate: {
                gte: 60,
              },
            },
          ],
        },
      });
      break;
    case "EXPERT":
      problems = await prisma.problem.findMany({
        where: {
          OR: [
            {
              difficulty: "Medium",
              acRate: {
                lte: 40,
              },
            },
            {
              difficulty: "Hard",
            },
          ],
        },
      });
      break;
    default:
      problems = [];
      break;
  }
  const problem = sample(problems);
  if (!problem) {
    throw new Error("No valid problem found");
  }
  return problem;
}
