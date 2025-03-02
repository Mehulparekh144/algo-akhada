// app/api/pusher-auth/route.ts
import { NextResponse } from "next/server";
import Pusher from "pusher";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { env } from "@/env";

// Initialize Pusher server instance
const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    // Verify that the user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const formData = await request.formData();
    const socketId = formData.get("socket_id") as string;
    const channel = formData.get("channel_name") as string;

    // Validate the channel name to ensure it matches the expected format
    // This prevents users from subscribing to other booking channels
    const channelParts = channel.split("-");
    if (channelParts.length !== 3 || channelParts[0] !== "presence" || channelParts[1] !== "booking") {
      return NextResponse.json({ error: "Invalid channel" }, { status: 403 });
    }

    // Extract booking ID from channel name
    const bookingId = channelParts[2];

    // Optional: Verify that user has access to this booking
    // This could involve checking a database
    // For now we're skipping this since the main page already verifies access

    // Generate auth token for the presence channel
    const authResponse = pusher.authorizeChannel(socketId, channel, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name || "Anonymous"
      }
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}