"use client";
import React from "react";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { User } from "@prisma/client";

interface UserButtonProps {
	user: User;
}

function UserButton({ user }: UserButtonProps) {
	if (user) {
		return (
			<>
				<h1>{user.name}</h1>
				<Button onClick={() => signOut()}>Sign out</Button>
			</>
		);
	}
	return <Button onClick={() => signIn()}>Sign in with github</Button>;
}

export default UserButton;
