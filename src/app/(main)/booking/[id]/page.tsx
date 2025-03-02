import React from "react";
import { getBooking } from "./actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ActiveSession from "./ActiveSession";
import WaitingRoom from "./WaitingRoom";

export default async function CurrentBookingPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const server = await auth.api.getSession({
		headers: await headers(),
	});

	if (!server?.user) {
		redirect("/");
	}

	const { id } = await params;
	const booking = await getBooking(id);

	if (!booking) {
		redirect("/");
	}

	const { user1, user2, problem1, problem2 } = booking;

	if (!user2 || !problem2 || !problem1) {
		redirect("/");
	}

	const isUser1 = server.user.id === user1.id;
	const isUser2 = server.user.id === user2?.id;

	if (!isUser1 && !isUser2) {
		redirect("/");
	}

	// Pass current user ID and other user ID to the WaitingRoom component
	const currentUserId = server.user.id;
	const otherUserId = isUser1 ? user2.id : user1.id;
	const currentUserName = isUser1 ? user1.name : user2.name;
	const otherUserName = isUser1 ? user2.name : user1.name;

	return (
		<>
			<WaitingRoom
				bookingId={id}
				currentUserId={currentUserId}
				otherUserId={otherUserId}
				currentUserName={currentUserName}
				otherUserName={otherUserName}
				fallback={
					<ActiveSession
						bookingId={id}
						isUser1={isUser1}
						user1={user1}
						user2={user2}
						problem1={problem1}
						problem2={problem2}
					/>
				}
			/>
		</>
	);
}
