import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { getUser } from "@/app/actions";

async function DashboardPage() {
	const session = await getUser();
	if (!session) {
		redirect("/");
	}
	return (
		<div>
			<Button asChild>
				<Link href="/dashboard/booking">Book now</Link>
			</Button>
		</div>
	);
}

export default DashboardPage;
