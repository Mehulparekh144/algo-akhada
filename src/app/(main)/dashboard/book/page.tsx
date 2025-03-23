import { redirect } from "next/navigation";
import React from "react";
import BookingForm from "./BookingForm";
import { getUser } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DotBackground } from "@/components/ui/dot-background";
import { checkPendingFeedbacks } from "./actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogHeader,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function BookingPage() {
	const session = await getUser();

	if (!session) {
		redirect("/signin");
	}

	const pendingFeedbacks = await checkPendingFeedbacks(session.user.id);
	const overdueFeedbacks = pendingFeedbacks.filter((f) => f?.isOverdue);
	const warningMessage =
		overdueFeedbacks.length > 0
			? `You have ${overdueFeedbacks.length} overdue feedback(s) that are more than 3 days old. Please complete them before booking new sessions.`
			: `You have ${pendingFeedbacks.length} pending feedback(s). Please complete them before booking new sessions.`;

	return (
		<div className="min-h-screen flex items-center justify-center bg-background relative">
			<DotBackground />
			{pendingFeedbacks.length > 0 && (
				<AlertDialog open>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Warning</AlertDialogTitle>
						</AlertDialogHeader>
						<AlertDialogDescription>
							<Alert variant="warning">
								<AlertDescription>
									<div className="flex items-center gap-4">
										<AlertTriangle className="w-8 h-8" />
										{warningMessage}
									</div>
								</AlertDescription>
							</Alert>
						</AlertDialogDescription>
						<AlertDialogFooter>
							<AlertDialogAction asChild>
								<Button asChild>
									<Link href={"/dashboard/feedbacks?type=pending"}>
										Complete Feedback
									</Link>
								</Button>
							</AlertDialogAction>
							<AlertDialogCancel asChild>
								<Button variant="secondary" asChild>
									<Link href={"/dashboard"}>Cancel</Link>
								</Button>
							</AlertDialogCancel>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
			<div className="relative z-10 w-full max-w-3xl mx-4 md:mx-auto">
				<div className="backdrop-blur-sm bg-white/10 ring-1 ring-primary/20 dark:bg-white/5 rounded-2xl p-3 shadow-xl">
					<Card className=" w-full max-w-3xl bg-card">
						<CardHeader className="text-2xl font-display">
							<CardTitle>Book an akhada</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col">
							<BookingForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
