"use client";
import React, { useEffect } from "react";
import Pusher, { Members } from "pusher-js";
import { env } from "@/env";
import { cancelBooking } from "./actions";

interface WaitingRoomProps {
	bookingId: string;
	currentUserId: string;
	otherUserId: string;
	currentUserName: string;
	otherUserName: string;
	fallback: React.ReactNode;
}

export default function WaitingRoom({
	bookingId,
	currentUserId,
	otherUserId,
	otherUserName,
	fallback,
}: WaitingRoomProps) {
	const [isOtherUserPresent, setIsOtherUserPresent] = React.useState(false);
	const [timeRemaining, setTimeRemaining] = React.useState(600); // Initial display value

	useEffect(() => {
		// Get the start time from localStorage or set it if not existing
		const getStartTime = () => {
			const storedStartTime = localStorage.getItem(`waitingRoom_${bookingId}`);
			if (storedStartTime) { 
				return parseInt(storedStartTime, 10);
			} else {
				const newStartTime = Date.now();
				localStorage.setItem(
					`waitingRoom_${bookingId}`,
					newStartTime.toString()
				);
				return newStartTime;
			}
		};

		const startTime = getStartTime();
		const totalWaitTime = 600000; // 10 minutes in milliseconds

		// Set up Pusher
		const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
			cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
			forceTLS: true,
			authEndpoint: "/api/pusher-auth",
			auth: {
				params: {
					bookingId,
				},
			},
		});

		const presenceChannel = pusher.subscribe(`presence-booking-${bookingId}`);

		presenceChannel.bind(
			"pusher:subscription_succeeded",
			(members: Members) => {
				if (members.members[otherUserId]) {
					setIsOtherUserPresent(true);
				}
			}
		);

		presenceChannel.bind("pusher:member_added", (member: any) => {
			if (member.id === otherUserId) {
				setIsOtherUserPresent(true);
			}
		});

		presenceChannel.bind("pusher:member_removed", (member: any) => {
			if (member.id === otherUserId) {
				setIsOtherUserPresent(false);
			}
		});

		// Calculate elapsed time since start
		const calculateRemainingTime = () => {
			const now = Date.now();
			const elapsed = now - startTime;
			const remaining = Math.max(0, totalWaitTime - elapsed);
			return Math.floor(remaining / 1000); // Convert to seconds
		};

		// Update countdown timer and check for timeout
		const intervalId = setInterval(() => {
			const secondsRemaining = calculateRemainingTime();
			setTimeRemaining(secondsRemaining);

			// Redirect if time is up and other user is not present
			if (secondsRemaining <= 0 && !isOtherUserPresent) {
				clearInterval(intervalId);
				handleTimeout();
			}
		}, 1000);

		// Function to handle timeout
		const handleTimeout = async () => {
			// Clear the localStorage entry
			localStorage.removeItem(`waitingRoom_${bookingId}`);
			// Cancel booking and redirect
			await cancelBooking(bookingId);
			window.location.href = "/dashboard";
		};

		return () => {
			// Cleanup
			pusher.unsubscribe(`presence-booking-${bookingId}`);
			pusher.disconnect();
			clearInterval(intervalId);

			// If other user has joined, clear the localStorage entry
			if (isOtherUserPresent) {
				localStorage.removeItem(`waitingRoom_${bookingId}`);
			}
		};
	}, [bookingId, currentUserId, otherUserId, isOtherUserPresent]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	// If other user is present, render the session component
	if (isOtherUserPresent) {
		return fallback;
	}

	// Otherwise, show waiting message
	return (
		<div className="flex flex-col bg-secondary items-center justify-center min-h-screen p-4">
			<div className="bg-background rounded-lg shadow-md p-8 max-w-md w-full text-center">
				<h2 className="text-2xl font-bold mb-4">
					Waiting for other participant
				</h2>
				<p className="mb-6">
					{otherUserName} hasn't joined the session yet. The session will start
					automatically when they join.
				</p>
				<div className="bg-secondary p-4 rounded-md mb-4">
					<p className="text-muted-foreground">Time remaining before redirect:</p>
					<p className="text-xl font-mono">{formatTime(timeRemaining)}</p>
				</div>
				<p className="text-sm text-gray-500">
					If the other participant doesn't join within the remaining time,
					you'll be redirected to the dashboard.
				</p>
			</div>
		</div>
	);
}
