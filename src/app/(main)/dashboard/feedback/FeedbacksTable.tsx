"use client";
import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	EyeIcon,
	FlagOffIcon,
} from "lucide-react";
import type { Prisma } from "@prisma/client";
import {
	Select,
	SelectItem,
	SelectContent,
	SelectValue,
	SelectTrigger,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogTitle,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogDescription,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";

type FeedbackWithBooking = Prisma.FeedbackGetPayload<{
	include: {
		booking: {
			include: {
				problem1: true;
				problem2: true;
				user1: true;
				user2: true;
			};
		};
	};
}>;

const FeedbacksTable = ({
	feedbacks,
}: { feedbacks: FeedbackWithBooking[] }) => {
	const [currentPage, setCurrentPage] = useState<number>(
		Number(new URLSearchParams(window.location.search).get("page")) || 1,
	);
	const [resultsPerPage, setResultsPerPage] = useState<number>(10);
	const [paginatedFeedbacks, setPaginatedFeedbacks] = useState<
		FeedbackWithBooking[]
	>([]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * resultsPerPage;
		const endIndex = startIndex + resultsPerPage;
		setPaginatedFeedbacks(feedbacks.slice(startIndex, endIndex));
	}, [currentPage, feedbacks, resultsPerPage]);

	const totalPages = Math.ceil(feedbacks.length / resultsPerPage);

	const getPageNumbers = () => {
		const pages = [];

		const groupIndex = Math.ceil(currentPage / 3) - 1;
		const start = groupIndex * 3 + 1;

		for (let i = 0; i < 3; i++) {
			if (start + i <= totalPages) {
				pages.push(start + i);
			} else {
				break;
			}
		}
		return pages;
	};

	return (
		<div className="bg-background h-[87vh] flex flex-col gap-4">
			<div className="[&>div]:h-[38rem]">
				<Table className="border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
					<TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
						<TableRow className="hover:bg-transparent">
							<TableHead>Date</TableHead>
							<TableHead>Problem</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedFeedbacks.map(
							(feedback: FeedbackWithBooking, index: number) => {
								const problem =
									feedback.booking.user1Id === feedback.userId
										? feedback.booking.problem1
										: feedback.booking.problem2;

								return (
									<TableRow className="py-2" key={feedback.id}>
										<TableCell>
											<p>{feedback.createdAt.toLocaleDateString()}</p>
										</TableCell>
										<TableCell>
											<p>{problem?.title}</p>
										</TableCell>
										<TableCell>
											<p>{feedback.rating}</p>
										</TableCell>
										<TableCell className="flex gap-2 items-center">
											<Button size={"sm"} asChild>
												<Link
													href={`/dashboard/feedback/${feedback.bookingId}`}
												>
													<EyeIcon className="w-4 h-4" />
													View
												</Link>
											</Button>
											<FeedbackReportModal />
										</TableCell>
									</TableRow>
								);
							},
						)}
					</TableBody>
				</Table>
			</div>
			<div className="w-full mt-auto h-10 flex items-center justify-between bg-background">
				<div>
					<Select onValueChange={(value) => setResultsPerPage(Number(value))}>
						<SelectTrigger>
							<SelectValue placeholder="Select Results per page" />
						</SelectTrigger>
						<SelectContent className="w-full">
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="10">10 (Default)</SelectItem>
							<SelectItem value="20">20</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<p className="text-sm text-muted-foreground">
					Showing {currentPage} of {totalPages}
				</p>
				<div className="flex items-center">
					<Button
						size="icon"
						variant="secondary"
						className="rounded-r-none"
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						className="rounded-none"
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					{getPageNumbers().map((pageNum) => (
						<Button
							key={`page-${pageNum}`}
							size="icon"
							className="rounded-none"
							variant={currentPage === pageNum ? "default" : "outline"}
							onClick={() => setCurrentPage(pageNum)}
						>
							{pageNum}
						</Button>
					))}

					<Button
						size="icon"
						variant="outline"
						onClick={() =>
							setCurrentPage((prev) => Math.min(totalPages, prev + 1))
						}
						className="rounded-none"
						disabled={currentPage === totalPages}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="secondary"
						className="rounded-l-none"
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

const FeedbackReportModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button size={"sm"} variant="secondary">
					<FlagOffIcon className="w-4 h-4" />
					Report
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Report Feedback</AlertDialogTitle>
					<AlertDialogDescription>
						Please be sure about reporting this feedback. We take it seriously.
						False reports will result in a ban.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button variant="destructive">Report</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default FeedbacksTable;
