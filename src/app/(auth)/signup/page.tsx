import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Signup from "./Signup";
import { signup } from "./actions";

export default async function SigninPage() {
	const session = await auth();

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="border min-h-screen flex justify-center items-center">
			<Signup signup={signup} />
		</div>
	);
}
