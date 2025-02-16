"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import pusherClient from "@/lib/pusher-client";
import { Booking } from "@prisma/client";
import { User } from "better-auth";
import React from "react";

interface RoomDetailsProps {
	booking: Booking;
	user: User;
}

function RoomDetails({ booking, user }: RoomDetailsProps) {
	const [messages, setMessages] = React.useState<
		{ message: string; userName: string }[]
	>([]);
	const [message, setMessage] = React.useState("");

	React.useEffect(() => {
		const channel = pusherClient.subscribe(`booking-${booking.id}`);

		channel.bind("new-message", (data: { message: string; user: User }) => {
			setMessages((prev) => [
				...prev,
				{ message: data.message, userName: data.user.name },
			]);
		});

		return () => {
			pusherClient.unsubscribe(`booking-${booking.id}`);
		};
	}, [booking.id]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await fetch("/api/message", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message: message,
				bookingId: booking.id,
				user: user,
			}),
		});

		setMessage("");
	}

	return (
		<div className="h-full w-full flex flex-col">
			RoomDetails
			<div>
				{messages.map((msg: any, i) => (
					<div key={i}>
						<strong>{msg.userName}: </strong>
						{msg.message}
					</div>
				))}
			</div>
			<form onSubmit={handleSubmit} className="flex gap-2 mt-auto ">
				<Input
					placeholder="Send Message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<Button disabled={!message.length}>Submit</Button>
			</form>
		</div>
	);
}

export default RoomDetails;
