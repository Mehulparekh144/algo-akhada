import { redirect } from "next/navigation";
import React from "react";
import { getUser } from "@/app/actions";
import { Separator } from "@/components/ui/separator";
import UpcomingBookings from "./UpcomingBookings";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function DashboardPage() {
  const session = await getUser();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold p-4">
        Welcome to the dashboard, {session?.user?.name}!
      </h1>
      <div className="space-y-3 px-4 py-2">
        <UpcomingBookings user={session.user} />
        <Button asChild>
          <Link href={"/dashboard/book"}>Book an akhada</Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
