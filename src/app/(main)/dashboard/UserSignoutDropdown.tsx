"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	ChevronsUpDown,
	LogOutIcon,
	Moon,
	Sun,
} from "lucide-react";
import type { User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const FALLBACK_STRING = "https://github.com/shadcn.png";

async function signOut() {
	await authClient.signOut({
		fetchOptions: {
			onResponse: () => {
				window.location.href = "/signin";
			},
		},
	});
}

function UserSignoutDropdown({ user }: { user: User | undefined }) {
	const { theme, setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size={"lg"}
					variant={"ghost"}
					className="w-full flex items-center gap-2 py-6"
				>
					<Avatar className="w-10 h-10">
						<AvatarImage src={user?.image ?? FALLBACK_STRING} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="text-left">
						<p>{user?.name}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</div>
					<ChevronsUpDown className="w-4 h-4 ml-auto" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" className="w-full">
				<DropdownMenuItem onClick={() => signOut()}>
					Signout <LogOutIcon className="ml-auto" />
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						Theme 
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme("light")}>
								<Sun className="mr-2 h-4 w-4" />
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								<Moon className="mr-2 h-4 w-4" />
								Dark
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserSignoutDropdown;
