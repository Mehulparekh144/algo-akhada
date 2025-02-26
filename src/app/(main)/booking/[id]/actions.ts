"use server"

import { prisma } from "@/lib/prisma"



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

export async function completeBooking(id : string){
  await prisma.booking.update({
    where : {id},
    data : {
      status : "COMPLETED"
    }
  })
}

export async function cancelBooking(id : string){
  await prisma.booking.update({
    where : {id},
    data : {
      status : "CANCELLED"
    }
  })
}

