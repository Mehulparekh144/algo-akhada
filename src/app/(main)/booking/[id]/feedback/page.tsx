import React from "react";
import { getBooking } from "../actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import FeedbackForm from "./FeedbackForm";
import { Separator } from "@/components/ui/separator";
import { Smile } from "lucide-react";
import TimedAlert from "./TimedAlert";

const FeedbackPage = async ({
	params,
}: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	const booking = await getBooking(id);

	if (!booking) {
		redirect("/");
	}

	const server = await auth.api.getSession({
		headers: await headers(),
	});

	if (!server || !server.user) {
		redirect("/");
	}

	if (
		server.user.id !== booking.user1Id &&
		server.user.id !== booking.user2Id
	) {
		redirect("/");
	}

	const otherUser =
		server.user.id === booking.user1Id ? booking.user2 : booking.user1;

	const currentUser =
		server.user.id === booking.user1Id ? booking.user2 : booking.user1;

	if (!otherUser || !currentUser) {
		redirect("/");
	}

	return (
		<div className="w-screen relative h-screen flex  items-center justify-center">
			<TimedAlert />
			<div className="w-full max-w-2xl mx-auto">
				<h1 className="text-2xl font-semibold font-display">
					Feedback for {otherUser.name}
				</h1>
				<p className="text-sm text-muted-foreground">
					Please provide feedback for {otherUser.name}
				</p>

				<Separator className="my-4" />
				<FeedbackForm
					bookingId={id}
					otherUser={otherUser}
					currentUser={currentUser}
				/>
				<Separator className="my-4" />
				<footer className="mt-4 text-muted-foreground flex items-center gap-2">
					<Smile className="w-4 h-4" />
					<p className="text-sm ">
						Please be honest, constructive and helpful.
					</p>
				</footer>
			</div>
		</div>
	);
};

export default FeedbackPage;
