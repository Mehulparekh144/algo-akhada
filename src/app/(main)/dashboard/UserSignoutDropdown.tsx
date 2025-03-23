"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
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
	LogOut,
	Moon,
	Sun,
	UserIcon,
	Bell,
	CreditCard,
} from "lucide-react";
import type { User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { useSidebar } from "@/components/ui/sidebar";

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
	const { isMobile } = useSidebar();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="lg"
					variant="ghost"
					className="w-full flex items-center gap-2 py-6 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage
							src={user?.image ?? FALLBACK_STRING}
							alt={user?.name ?? ""}
						/>
						<AvatarFallback className="rounded-lg">
							{user?.name?.slice(0, 2).toUpperCase() ?? "CN"}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{user?.name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{user?.email}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				side={isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={user?.image ?? FALLBACK_STRING}
								alt={user?.name ?? ""}
							/>
							<AvatarFallback className="rounded-lg">
								{user?.name?.slice(0, 2).toUpperCase() ?? "CN"}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user?.name}</span>
							<span className="truncate text-xs text-muted-foreground">
								{user?.email}
							</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserIcon className="mr-2 h-4 w-4" />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard className="mr-2 h-4 w-4" />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell className="mr-2 h-4 w-4" />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Sun className="mr-2 h-4 w-4" />
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
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOut()}>
					<LogOut className="mr-2 h-4 w-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserSignoutDropdown;
