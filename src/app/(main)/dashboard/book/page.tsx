import { redirect } from "next/navigation";
import React from "react";
import BookingForm from "./BookingForm";
import { getUser } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BookingPage() {
	const session = await getUser();

	if (!session) {
		redirect("/signin");
	}
	return (
		<div className="flex items-center justify-center w-full h-full">
			<Card className="w-full max-w-3xl bg-card">
				<CardHeader className="text-2xl font-display">
					<CardTitle>Book an akhada</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col">
					<BookingForm />
				</CardContent>
			</Card>
		</div>
	);
}
