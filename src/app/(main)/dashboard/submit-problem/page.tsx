import React from "react";
import SubmitForm from "./SubmitForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SubmitFormPage() {
	const session = await auth();

	if (!session) {
		redirect("/");
	}

	return (
		<main className="min-h-screen flex flex-col w-full">
			<h1 className="text-2xl font-bold p-4">Submit Problem</h1>
			<div
				className="flex-grow flex flex-col"
				style={{ height: "calc(100vh - 4rem)" }}
			>
				<SubmitForm />
			</div>
		</main>
	);
}
