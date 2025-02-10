import { auth } from "@/auth";
import React from "react";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import { getBooking } from "./actions";
import { redirect } from "next/navigation";

export default async function CurrentBookingPage({
	params,
}: {
	params: { id: string };
}) {
	const server = await auth();

	const booking = await getBooking(params.id);
	if (!booking) {
		redirect("/");
	}

	return (
		<div className="grid grid-cols-3">
			<ProblemDescription problemId={booking.problem1Id ?? ""} />
			<div className="col-span-2">
				<CodeEditor />
				<TestCases />
			</div>
		</div>
	);
}
