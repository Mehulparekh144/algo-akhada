import { env } from "@/env";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  secret: env.PUSHER_SECRET,
  useTLS: true
})

export async function POST(req: Request) {
  const { message, bookingId, user } = await req.json();
  await pusher.trigger(`booking-${bookingId}`, "new-message", {
    message,
    user
  })

  return NextResponse.json({ success: true });
}

