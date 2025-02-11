import React from "react";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import { getBooking } from "./actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function CurrentBookingPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const server = await auth.api.getSession({
		headers: await headers(),
	});

	const { id } = await params;

	const booking = await getBooking(id);
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
