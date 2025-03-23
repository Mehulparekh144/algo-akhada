import type { Booking, BookingStatus } from "@prisma/client";
import type { User } from "better-auth";
import { getTopFivePastBookings } from "./actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface PastBookingsProps {
	user: User | undefined;
}
const STATUS_COLORS: Record<
	BookingStatus,
	VariantProps<typeof badgeVariants>
> = {
	PENDING: { variant: "booking_pending" },
	ACCEPTED: { variant: "booking_accepted" },
	CANCELLED: { variant: "booking_cancelled" },
	COMPLETED: { variant: "default" },
};

export const PastBookings = async ({ user }: PastBookingsProps) => {
	const bookings = await getTopFivePastBookings();
	function getProblem(booking: Booking, userId: string) {
		if (booking.user1Id === userId) {
			return booking?.problem2Id;
		}
		return booking?.problem1Id;
	}

	function slugToTitle(slug: string | null) {
		if (!slug) {
			return "TBD";
		}
		return slug
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	return (
		<div className="p-4 space-y-3">
			<h2 className="text-xl font-display font-semibold">Past Bookings</h2>
			<div>
				{!bookings?.length ? (
					<div className="text-center">
						<p className="text-muted-foreground text-sm">No past bookings</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Booking Number</TableHead>
								<TableHead>Problem to ask</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Feedback</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{bookings?.map((booking, idx) => {
								return (
									<TableRow key={booking.id}>
										<TableCell>{idx + 1}</TableCell>
										<TableCell>
											{slugToTitle(getProblem(booking, user?.id ?? ""))}
										</TableCell>
										<TableCell>
											<Badge variant={STATUS_COLORS[booking.status].variant}>
												{booking.status}
											</Badge>
										</TableCell>
										<TableCell>
											{formatDate(booking.date, "MMM d yyyy")}{" "}
										</TableCell>
										<TableCell>
											{formatDate(booking.startTime, "HH:mm aa")}
										</TableCell>
										<TableCell>
											<Button variant={"link"} asChild>
												<Link href={`/dashboard/feedback/${booking.id}`}>
													View Feedback
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>
			{bookings && bookings?.length >= 5 && (
				<div className="text-center">
					<Link
						href={"/dashboard/bookings"}
						className="text-xs text-center underline text-muted-foreground "
					>
						View All
					</Link>
				</div>
			)}
		</div>
	);
};
