"use client";
import React, { useEffect, useCallback, useRef } from "react";
import Pusher, { type Members, type PresenceChannel } from "pusher-js";
import { env } from "@/env";
import { cancelBooking } from "./actions";
import type { Booking } from "@prisma/client";
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	isSameDay,
	format,
} from "date-fns";
import { Clock, ArrowLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface WaitingRoomProps {
	bookingId: string;
	currentUserId: string;
	otherUserId: string;
	currentUserName: string;
	otherUserName: string;
	fallback: React.ReactNode;
	booking: Booking;
}

interface PusherMember {
	id: string;
	info?: Record<string, unknown>;
}

export default function WaitingRoom({
	bookingId,
	currentUserId,
	otherUserId,
	otherUserName,
	fallback,
	booking,
}: WaitingRoomProps) {
	const [isOtherUserPresent, setIsOtherUserPresent] = React.useState(false);
	const [timeRemaining, setTimeRemaining] = React.useState(600);
	const [sessionStartTime, setSessionStartTime] = React.useState<string>("");
	const pusherChannelRef = useRef<PresenceChannel | null>(null);

	// Function to check if the session should start now
	const shouldStartSession = useCallback(() => {
		const now = new Date();
		const sessionDateTime = new Date(booking.startTime);

		// Check if it's the same day and within 10 minutes of start time
		return (
			isSameDay(now, sessionDateTime) &&
			Math.abs(differenceInMinutes(now, sessionDateTime)) <= 10
		);
	}, [booking.startTime]);

	// Function to get human-readable time until session
	const getTimeUntilSession = useCallback(() => {
		const now = new Date();
		const sessionDateTime = new Date(booking.startTime);

		const days = differenceInDays(sessionDateTime, now);
		const hoursLeft = differenceInHours(sessionDateTime, now) % 24;
		const minutesLeft = differenceInMinutes(sessionDateTime, now) % 60;

		// If all differences are 0 or negative, show "Starting soon"
		if (days <= 0 && hoursLeft <= 0 && minutesLeft <= 0) {
			return "Starting soon";
		}

		let timeMessage = "";
		if (days > 0) {
			timeMessage += `${days} day${days > 1 ? "s" : ""} `;
		}
		if (hoursLeft > 0) {
			timeMessage += `${hoursLeft} hour${hoursLeft > 1 ? "s" : ""} `;
		}
		if (minutesLeft > 0) {
			timeMessage += `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}`;
		}

		// Add the actual session time for reference
		const formattedTime = format(sessionDateTime, "h:mm a");
		return `${timeMessage.trim()} (at ${formattedTime})`;
	}, [booking.startTime]);

	useEffect(() => {
		// If it's not time for the session yet, just set the display time
		if (!shouldStartSession()) {
			setSessionStartTime(getTimeUntilSession());
			return;
		}

		const TOTAL_WAIT_TIME = 600000; // 10 minutes in milliseconds
		const STORAGE_KEY = `waitingRoom_${bookingId}`;

		// Get the start time from localStorage or set it if not existing
		const getStartTime = () => {
			const storedStartTime = localStorage.getItem(STORAGE_KEY);
			if (storedStartTime) {
				return Number.parseInt(storedStartTime, 10);
			}
			const newStartTime = Date.now();
			localStorage.setItem(STORAGE_KEY, newStartTime.toString());
			return newStartTime;
		};

		const startTime = getStartTime();

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

		const channelName = `presence-booking-${bookingId}`;
		const channel = pusher.subscribe(channelName) as PresenceChannel;
		pusherChannelRef.current = channel;

		const handleMemberPresence = (memberId: string) => {
			if (memberId === otherUserId) {
				setIsOtherUserPresent(true);
			}
		};

		const handleMemberRemoval = (memberId: string) => {
			if (memberId === otherUserId) {
				setIsOtherUserPresent(false);
			}
		};

		channel.bind("pusher:subscription_succeeded", (members: Members) => {
			if (members.members[otherUserId]) {
				setIsOtherUserPresent(true);
			}
		});

		channel.bind("pusher:member_added", (member: PusherMember) => {
			handleMemberPresence(member.id);
		});

		channel.bind("pusher:member_removed", (member: PusherMember) => {
			handleMemberRemoval(member.id);
		});

		// Calculate elapsed time since start
		const calculateRemainingTime = () => {
			const now = Date.now();
			const elapsed = now - startTime;
			const remaining = Math.max(0, TOTAL_WAIT_TIME - elapsed);
			return Math.floor(remaining / 1000); // Convert to seconds
		};

		// Handle timeout
		const handleTimeout = async () => {
			localStorage.removeItem(STORAGE_KEY);
			await cancelBooking(bookingId);
			window.location.href = "/dashboard";
		};

		// Update countdown timer and check for timeout
		const intervalId = setInterval(() => {
			const secondsRemaining = calculateRemainingTime();
			setTimeRemaining(secondsRemaining);

			// Redirect if time is up and other user is not present
			if (secondsRemaining <= 0 && !isOtherUserPresent) {
				clearInterval(intervalId);
				void handleTimeout();
			}
		}, 1000);

		return () => {
			// Cleanup
			pusher.unsubscribe(channelName);
			pusher.disconnect();
			clearInterval(intervalId);

			// If other user has joined, clear the localStorage entry
			if (isOtherUserPresent) {
				localStorage.removeItem(STORAGE_KEY);
			}
		};
	}, [
		bookingId,
		otherUserId,
		isOtherUserPresent,
		shouldStartSession,
		getTimeUntilSession,
	]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	// Calculate progress for the progress bar (0-100)
	const calculateProgress = (seconds: number) => {
		return Math.round((seconds / 600) * 100);
	};

	// If other user is present, show fallback content
	if (isOtherUserPresent) {
		return <div className="min-h-screen p-4 space-y-6">{fallback}</div>;
	}

	// If it's not time for the session yet
	if (!shouldStartSession()) {
		return (
			<main className="flex flex-col bg-secondary items-center justify-center min-h-screen p-4">
				<div className="bg-background rounded-lg shadow-md p-8 max-w-md w-full text-center space-y-6">
					<h2 className="text-2xl font-bold font-display mb-4">
						Your Session Starts Soon
					</h2>
					<div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg mb-6 border border-border/50">
						<div className="flex items-center justify-center mb-4">
							<Clock className="h-6 w-6 text-primary mr-2" />
							<p className="text-muted-foreground">
								Time until your session begins:
							</p>
						</div>
						<p className="text-3xl font-semibold font-display text-primary">
							{sessionStartTime}
						</p>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Please return to this page when it's time for your session. The
						waiting room will be activated 10 minutes before the scheduled time.
					</p>
					<Button variant="outline" className="mt-4" asChild>
						<Link href="/dashboard" className="flex items-center gap-2">
							<ArrowLeftCircle className="h-4 w-4" />
							Back to Dashboard
						</Link>
					</Button>
				</div>
			</main>
		);
	}

	// Otherwise, show waiting room message
	return (
		<main className="flex flex-col bg-secondary items-center justify-center min-h-screen p-4">
			<div className="bg-background rounded-lg shadow-md p-8 max-w-md w-full">
				<div className="text-center mb-8 space-y-4">
					<h2 className="text-2xl font-display font-bold">
						Waiting for other participant
					</h2>
					<div className="bg-secondary/50 backdrop-blur-sm p-4 rounded-lg border border-border/50">
						<p className="text-muted-foreground">
							{otherUserName} hasn't joined the session yet. The session will
							start automatically when they join.
						</p>
					</div>
				</div>

				<div className="space-y-6">
					<div
						className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg border border-border/50"
						aria-live="polite"
					>
						<div className="text-center space-y-4">
							<div className="flex items-center justify-center gap-2">
								<Clock className="h-5 w-5 text-primary" />
								<p className="text-muted-foreground">
									Time remaining before redirect:
								</p>
							</div>
							<p
								className="text-4xl font-mono font-bold text-primary"
								aria-label={`${timeRemaining} seconds remaining`}
							>
								{formatTime(timeRemaining)}
							</p>
							<Progress
								value={calculateProgress(timeRemaining)}
								className="h-2"
							/>
						</div>
					</div>
					<p className="text-sm text-muted-foreground text-center leading-relaxed">
						If the other participant doesn't join within the remaining time,
						you'll be redirected to the dashboard.
					</p>
					<Button variant="outline" className="w-full" asChild>
						<Link
							href="/dashboard"
							className="flex items-center justify-center gap-2"
						>
							<ArrowLeftCircle className="h-4 w-4" />
							Back to Dashboard
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
