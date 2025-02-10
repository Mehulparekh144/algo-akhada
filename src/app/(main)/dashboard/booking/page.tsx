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
		<main className="min-h-screen flex w-full justify-center items-center">
			<div className="w-full max-w-4xl px-16">
				<h1 className="text-2xl font-bold">Book an akhada</h1>
				<div className="flex flex-col">
					<BookingForm />
				</div>
			</div>
		</main>
	);
}
