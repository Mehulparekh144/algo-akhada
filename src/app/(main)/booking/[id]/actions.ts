"use server"

import { prisma } from "@/lib/prisma"



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

export async function getProblemById(slug: string) {
  return await prisma.problem.findUnique({
    where: {
      titleSlug: slug
    }
  })
}