import React from "react";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import { getBooking, getProblemById } from "./actions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import RoomDetails from "./RoomDetails";

export default async function CurrentBookingPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const server = await auth.api.getSession({
		headers: await headers(),
	});

	if (!server?.user) {
		redirect("/");
	}

	const { id } = await params;

	const booking = await getBooking(id);
	if (!booking) {
		redirect("/");
	}

	const problem = await getProblemById(booking.problem1Id ?? "");
	if (!problem) {
		redirect("/");
	}

	return (
		<ResizablePanelGroup
			direction="horizontal"
			className="max-w-md rounded-lg border md:min-w-full max-h-screen"
		>
			<ResizablePanel defaultSize={30}>
				<ProblemDescription problem={problem} />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={55}>
				<ResizablePanelGroup direction="vertical">
					<ResizablePanel defaultSize={75}>
						<CodeEditor />
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={25}>
						<TestCases problem={problem} />
					</ResizablePanel>
				</ResizablePanelGroup>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={15}>
				<RoomDetails booking={booking} user={server?.user} />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
