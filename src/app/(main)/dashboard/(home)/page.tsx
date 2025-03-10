import { redirect } from "next/navigation";
import React from "react";
import { getUser } from "@/app/actions";
import UpcomingBookings from "./UpcomingBookings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PastBookings } from "./PastBookings";
import { Separator } from "@/components/ui/separator";

async function DashboardPage() {
  const session = await getUser();
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="w-full bg-secondary h-full relative">
      <h1 className="text-2xl font-semibold p-4">
        Welcome to the dashboard, {session?.user?.name}!
      </h1>
      <Separator />
      <div className="space-y-3">
        <UpcomingBookings user={session.user} />
        <PastBookings user={session.user} />
        <Button className="absolute bottom-5 right-5" asChild>
          <Link href={"/dashboard/book"}>Book an akhada</Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
