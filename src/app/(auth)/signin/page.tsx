import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Signin from "./Signin";

export default async function SigninPage() {
	const session = await auth();

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="border min-h-screen flex justify-center items-center">
			<Signin />
		</div>
	);
}
