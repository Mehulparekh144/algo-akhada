"use server"

import { prisma } from "@/lib/prisma"
import { getUniqueProblem } from "@/lib/problemsClient"


export async function getBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user1: true,
      user2: true,
    }
  })

  return booking
}

export async function getProblemById(id: string) {
  return await getUniqueProblem(id);
}