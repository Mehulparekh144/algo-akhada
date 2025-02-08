import { auth } from "@/auth";
import UserButton from "@/components/UserButton";
import { dmsans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default async function Home() {
	const session = await auth();
	return (
		<div className="flex items-center min-h-screen max-w-8xl justify-center">
			<div className="text-center space-y-4">
				<h1 className={cn("text-7xl font-semibold", dmsans.className)}>
					AlgoAkhada
				</h1>
				<UserButton user={session?.user} />
			</div>
		</div>
	);
}
