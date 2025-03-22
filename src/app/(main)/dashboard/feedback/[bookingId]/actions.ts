"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import type { Feedback } from "@prisma/client";
import { headers } from "next/headers";


export const getFeedback = async (bookingId: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const feedback = await prisma.feedback.findFirst({
    where: {
      bookingId: bookingId,
      userId: session.user.id
    },
    include: {
      booking: {
        include: {
          problem1: true,
          problem2: true,
        }
      }
    }
  })

  return feedback;
}
