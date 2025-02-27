import { env } from "@/env";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  useTLS: true,
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { channel, event, data } = body;

    console.log("Pusher event:", { channel, event, data });

    if (!channel || !event || !data) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await pusher.trigger(channel, event, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
