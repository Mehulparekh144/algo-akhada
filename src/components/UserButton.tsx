"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";

interface UserButtonProps {
	user: User | undefined;
}

async function signOut() {
	await authClient.signOut({
		fetchOptions: {
			onResponse: () => {
				window.location.href = "/signin";
			},
		},
	});
}

function UserButton({ user }: UserButtonProps) {
	if (user) {
		return (
			<>
				<h1>{user.name}</h1>
				<Button asChild>
					<Link href={"/dashboard"}>Dashboard</Link>
				</Button>
				<Button onClick={signOut}>Sign out</Button>
			</>
		);
	}
	return (
		<Button>
			<Link href={"/signin"}>Signin</Link>
		</Button>
	);
}

export default UserButton;
