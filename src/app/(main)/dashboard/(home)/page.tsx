import { redirect } from "next/navigation";
import React from "react";
import { getUser } from "@/app/actions";
import UpcomingBookings from "./UpcomingBookings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PastBookings } from "./PastBookings";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

async function DashboardPage() {
	const session = await getUser();

	return (
		<div className="w-full min-h-screen p-6 relative">
			<Card className="mb-8 p-6 backdrop-blur-sm">
				<div className="flex flex-col space-y-2">
					<h1 className="text-2xl font-bold text-primary font-display">
						Welcome back, {session?.user?.name}! 👋
					</h1>
					<p className="text-muted-foreground text-sm">
						Manage your akhada bookings and view your training schedule all in
						one place.
					</p>
				</div>
			</Card>

			<div className="space-y-8 mb-20">
				<UpcomingBookings user={session?.user} />
				<Separator className="my-8" />
				<PastBookings user={session?.user} />
			</div>

			<div className="fixed bottom-8 right-8">
				<Button
					size="lg"
					className="shadow-lg hover:shadow-xl transition-all"
					asChild
				>
					<Link href="/dashboard/book" className="flex items-center gap-2">
						<span>Book an Akhada</span>
						<Calendar className="h-5 w-5" />
					</Link>
				</Button>
			</div>
		</div>
	);
}

export default DashboardPage;
