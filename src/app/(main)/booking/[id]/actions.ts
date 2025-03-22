"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { feedbackSchema, type FeedbackValues } from "@/lib/validations"
import { headers } from "next/headers"



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

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        user1Id: true,
        user2Id: true,
        feedbacks: true
      }
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Create the feedback
    const newFeedback = await prisma.feedback.create({
      data: {
        userId: otherUserId, // The user receiving the feedback
        feedbackProviderId: session.user.id, // The user providing the feedback
        bookingId: bookingId,
        rating: rating,
        didUserSolve: didUserSolve,
        whatDidUserDoRight: whatDidUserDoRight,
        whatDidUserDoWrong: whatDidUserDoWrong,
        howCanUserImprove: howCanUserImprove,
        additionalComments: additionalComments || "",
      }
    });

    return newFeedback;
  } catch (error) {
    console.error("Error providing feedback:", error);
    throw error;
  }
}

