"use server"

import { getUser } from "@/app/actions"
import { prisma } from "@/lib/prisma";

export default async function getTopFiveBookings() {
  const session = await getUser();
  if (!session) {
    return null;
  }

  const { user } = session;

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date()
      },
      OR: [
        {
          user1Id: user.id
        },
        {
          user2Id: user.id
        }
      ]
    },
    include: {
      user1: true,
      user2: true
    },
    orderBy: {
      date: "asc"
    },
    take: 5
  })

  return bookings;
}