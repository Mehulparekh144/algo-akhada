"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
	return <Button onClick={() => signIn()}>Github Sign</Button>;
}
