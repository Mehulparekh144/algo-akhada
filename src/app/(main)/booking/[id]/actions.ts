"use server"

import { prisma } from "@/lib/prisma"
import { feedbackSchema, type FeedbackValues } from "@/lib/validations"



export async function getBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user1: true,
      user2: true,
      problem1: true,
      problem2: true,
    }
  })

  return booking
}

export async function completeBooking(id: string) {

  const booking = await prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) {
    throw new Error("Booking not found")
  }

  await prisma.booking.update({
    where: { id },
    data: {
      status: "COMPLETED"
    }
  })
}

export async function cancelBooking(id: string) {
  await prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED"
    }
  })
}


export async function provideFeedback(bookingId: string, feedback: FeedbackValues, otherUserId: string) {
  try {
    const { rating, didUserSolve, whatDidUserDoRight, whatDidUserDoWrong, howCanUserImprove, additionalComments } = feedbackSchema.parse(feedback);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        user1Id: true,
        user2Id: true,
        feedback1Id: true,
        feedback2Id: true
      }
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Create the feedback
    const newFeedback = await prisma.feedback.create({
      data: {
        userId: otherUserId, // The user receiving the feedback
        bookingId: bookingId,
        rating: rating,
        didUserSolve: didUserSolve,
        whatDidUserDoRight: whatDidUserDoRight,
        whatDidUserDoWrong: whatDidUserDoWrong,
        howCanUserImprove: howCanUserImprove,
        additionalComments: additionalComments || "",
      }
    });

    // Update the booking with the feedback reference
    // If current user is user1, update feedback2Id (feedback for user2)
    // If current user is user2, update feedback1Id (feedback for user1)
    const isUser1 = booking.user1Id === otherUserId;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        [isUser1 ? 'feedback2Id' : 'feedback1Id']: newFeedback.id
      }
    });

    return newFeedback;
  } catch (error) {
    console.error("Error providing feedback:", error);
    throw error;
  }
}

