"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import type { User } from "better-auth";
import { authClient } from "@/lib/auth-client";

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
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-start text-base justify-between">
					<div>
						<p>{user?.name}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</div>
					<Avatar>
						<AvatarImage src={user?.image ?? FALLBACK_STRING} />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" className="">
				<DropdownMenuItem>
					<Button className="w-full" variant={"ghost"} onClick={signOut}>
						Signout <LogOutIcon className="ml-auto" />{" "}
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserSignoutDropdown;
