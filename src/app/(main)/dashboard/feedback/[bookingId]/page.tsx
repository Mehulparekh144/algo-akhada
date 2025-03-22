import React from "react";
import { getFeedback } from "./actions";
import { Separator } from "@/components/ui/separator";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const difficultyMap: Record<string, BadgeProps["variant"]> = {
	Easy: "easy",
	Medium: "medium",
	Hard: "hard",
};

const UserFeedbackPage = async ({
	params,
}: { params: Promise<{ bookingId: string }> }) => {
	const { bookingId } = await params;

	const feedback = await getFeedback(bookingId);

	if (!feedback) {
		return <div>No feedback found</div>;
	}

	const problem =
		feedback.booking.user1Id === feedback.userId
			? feedback.booking.problem1
			: feedback.booking.problem2;

	return (
		<div className="w-screen h-screen mx-auto max-w-2xl flex items-center justify-center py-4">
			<div className="w-full">
				<p className="text-3xl font-semibold font-display">Feedback</p>
				<Separator className="my-2" />
				<div className="flex justify-between items-center gap-3">
					<Link
						href={`https://leetcode.com/problems/${problem?.titleSlug}`}
						className="font-semibold text-muted-foreground hover:underline"
						target="_blank"
					>
						{problem?.title}
					</Link>
					{problem?.difficulty && (
						<Badge variant={difficultyMap[problem?.difficulty] ?? "default"}>
							{problem?.difficulty}
						</Badge>
					)}
				</div>
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Feedback Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-2">
							<Label className="font-semibold">Rating:</Label>
							<div className="flex items-center gap-1">
								{Array.from({ length: feedback.rating }).map((_, i) => (
									<Star
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={i}
										className="w-4 h-4 fill-yellow-400 text-yellow-400"
									/>
								))}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Label className="font-semibold">Problem Solved:</Label>
							<p className="text-muted-foreground text-sm">
								{feedback.didUserSolve ? "Yes" : "No"}
							</p>
						</div>
						<div className="space-y-1">
							<Label className="font-semibold">What went well:</Label>
							<p className="text-muted-foreground text-sm">
								{feedback.whatDidUserDoRight}
							</p>
						</div>
						<div className="space-y-1">
							<Label className="font-semibold">Areas for improvement:</Label>
							<p className="text-muted-foreground text-sm">
								{feedback.whatDidUserDoWrong}
							</p>
						</div>
						<div className="space-y-1">
							<Label className="font-semibold">Suggestions:</Label>
							<p className="text-muted-foreground text-sm">
								{feedback.howCanUserImprove}
							</p>
						</div>
						{feedback.additionalComments && (
							<div className="space-y-2">
								<Label className="font-semibold">Additional Comments:</Label>
								<p className="text-muted-foreground">
									{feedback.additionalComments}
								</p>
							</div>
						)}
					</CardContent>
				</Card>
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Session Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center gap-2">
							<Label className="font-semibold">Date:</Label>
							<p className="text-muted-foreground text-sm">
								{new Date(feedback.booking.date).toLocaleDateString()}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Label className="font-semibold">Time:</Label>
							<p className="text-muted-foreground text-sm">
								{new Date(feedback.booking.startTime).toLocaleTimeString()}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default UserFeedbackPage;
