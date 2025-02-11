import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LcProblem } from "./validations";
import { headers } from "next/headers";
import { auth } from "./auth";
import { Session, User } from "better-auth";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
