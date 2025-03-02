import { redirect } from "next/navigation";
import React from "react";
import Signup from "./Signup";
import { getUser } from "@/app/actions";
import TipSection from "../TipSection";

export default async function SigninPage() {
  const session = await getUser();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="border min-h-screen bg-secondary grid grid-cols-1 lg:grid-cols-2">
      <div className="md:mx-16 lg:mx-20 mx-4 h-full flex items-center justify-center">
        <Signup />
      </div>
      <div className="hidden relative lg:flex items-center justify-center dark:bg-black bg-white">
        <TipSection />
      </div>
    </div>
  );
}
