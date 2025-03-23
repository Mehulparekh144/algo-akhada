"use server";
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export const getFeedbacks = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const feedbacks = await prisma.feedback.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      booking: {
        include: {
          user2: true,
          user1: true,
          problem1: true,
          problem2: true
        }
      }
    },
    orderBy: {
      booking: {
        date: "desc"
      }
    },
  });

  return feedbacks;
};
