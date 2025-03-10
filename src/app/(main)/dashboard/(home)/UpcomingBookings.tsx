import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopFiveUpcomingBookings } from "./actions";
import { formatDate, intervalToDuration } from "date-fns";
import { Booking, BookingStatus } from "@prisma/client";
import { User } from "better-auth";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UpcomingBookingsProps {
  user: User;
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

export default async function UpcomingBookings({
  user,
}: UpcomingBookingsProps) {
  const bookings = await getTopFiveUpcomingBookings();

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

  function getDifferenceInMS(bigger: Date, smaller: Date) {
    return bigger.getTime() - smaller.getTime();
  }

  function getDifferencesInAll(bigger: Date, smaller: Date) {
    let { days, hours, minutes, seconds } = intervalToDuration({
      start: smaller,
      end: bigger,
    });
    if (!days) {
      days = 0;
    }
    if (!hours) {
      hours = 0;
    }
    if (!minutes) {
      minutes = 0;
    }
    if (!seconds) {
      seconds = 0;
    }

    return { days, hours, minutes, seconds };
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
      <div>
        {!bookings?.length ? (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              No upcoming bookings
            </p>
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking, idx) => {
                const diff = getDifferenceInMS(booking.date, new Date());
                const { days, hours, minutes, seconds } = getDifferencesInAll(
                  booking.date,
                  new Date(),
                );

                return (
                  <TableRow key={booking.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {slugToTitle(getProblem(booking, user.id))}
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
                      <Button
                        disabled={diff < 0 || booking.status === "CANCELLED"}
                        size={"sm"}
                        variant={"link"}
                      >
                        <Link href={`/booking/${booking.id}`}>
                          {diff > 0 ? (
                            <>
                              {days > 0
                                ? `Starts in ${days} day${days > 1 ? "s" : ""}`
                                : hours > 0
                                  ? `Starts in ${hours} hour${
                                      hours > 1 ? "s" : ""
                                    }`
                                  : minutes > 0
                                    ? `Starts in ${minutes} minute${
                                        minutes > 1 ? "s" : ""
                                      }`
                                    : `Starts in ${seconds} second${
                                        seconds > 1 ? "s" : ""
                                      }`}
                            </>
                          ) : diff === 0 ? (
                            "Join"
                          ) : (
                            "Cancelled"
                          )}
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
      {bookings?.length === 5 && (
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
}
