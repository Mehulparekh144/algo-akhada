import { redirect } from "next/navigation";
import React from "react";
import Signup from "./Signup";
import { getUser } from "@/app/actions";

export default async function SigninPage() {
	const session = await getUser();

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="border min-h-screen flex justify-center items-center">
			<Signup />
		</div>
	);
}
