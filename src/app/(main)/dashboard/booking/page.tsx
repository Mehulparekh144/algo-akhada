import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import BookingForm from "./BookingForm";

export default async function BookingPage() {
	const session = await auth();

	if (!session) {
		redirect("/");
	}
	return (
		<main className="min-h-screen flex flex-col w-full">
			<h1 className="text-2xl font-bold p-4">Book an akhada</h1>
			<div
				className="flex-grow flex flex-col"
				style={{ height: "calc(100vh - 4rem)" }}
			>
				<BookingForm />
			</div>
		</main>
	);
}
