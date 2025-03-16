import UserSignoutDropdown from "@/app/(main)/dashboard/UserSignoutDropdown";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, Settings } from "lucide-react";
import ThemeButton from "./theme-button";
import { getUser } from "@/app/actions";

const MENU_ITEMS = [
	{
		href: "/dashboard",
		icon: Home,
		text: "Home",
	},
	{
		href: "/dashboard/settings",
		icon: Settings,
		text: "Settings",
	},
];

export async function AppSidebar() {
	const session = await getUser();
	return (
		<Sidebar
			variant="sidebar"
			className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<SidebarHeader className="relative">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-20" />
				<Link
					href={"/dashboard"}
					className={cn(
						"relative z-10 flex items-center gap-2 px-6 py-4 text-2xl font-semibold font-display",
						"bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary",
					)}
				>
					AlgoAkhada
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarSeparator className="opacity-50" />
				<SidebarMenu className="px-3">
					{MENU_ITEMS.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton asChild>
								<Link href={item.href}>
									<item.icon />
									{item.text}
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="border-t">
				<SidebarMenu className="px-3 py-2">
					<SidebarMenuItem>
						<div className="px-3">
							<ThemeButton />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarSeparator className="opacity-50" />
				<SidebarMenu className="px-3 py-2">
					<SidebarMenuItem>
						<UserSignoutDropdown user={session?.user} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
