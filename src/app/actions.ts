"use server";

import { auth } from "@/lib/auth";
import type { Session, User } from "better-auth";
import { headers } from "next/headers";

export async function getUser(): Promise<{
	user: User;
	session: Session;
} | null> {
	return await auth.api.getSession({
		headers: await headers(),
	});
}
