import { redirect } from "next/navigation";
import React from "react";
import Signin from "./Signin";
import { getUser } from "@/app/actions";
import { DotBackground } from "@/components/ui/dot-background";

export default async function SigninPage() {
	const session = await getUser();

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
			{/* Dotted background pattern */}
			<DotBackground />

			{/* Decorative blurred circles */}
			<div className="absolute top-0 -left-4 w-72 h-72 bg-primary opacity-50 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
			<div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 opacity-50 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
			<div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 opacity-50 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />

			{/* Content */}
			<div className="relative z-10 w-full max-w-md mx-4 md:mx-auto">
				<div className="backdrop-blur-sm bg-white/10 ring-1 ring-primary/20 dark:bg-white/5 rounded-2xl p-3 shadow-xl">
					<Signin />
				</div>
			</div>
		</div>
	);
}
