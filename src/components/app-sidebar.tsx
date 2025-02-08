import UserSignoutDropdown from "@/app/(main)/dashboard/UserSignoutDropdown";
import { auth } from "@/auth";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { dmsans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { CodeSquare, Home, Medal, Settings } from "lucide-react";
import Link from "next/link";
import ThemeButton from "./theme-button";
import { text } from "stream/consumers";

const MENU_ITEMS = [
	{
		href: "/dashboard",
		icon: Home,
		text: "Home",
	},
	{
		href: "/dashboard/leadership",
		icon: Medal,
		text: "Rankings",
	},
	{
		href: "/dashboard/submit-problem",
		icon: CodeSquare,
		text: "Submit Problem",
	},
	{
		href: "/dashboard/settings",
		icon: Settings,
		text: "Settings",
	},
];

export async function AppSidebar() {
	const session = await auth();
	return (
		<Sidebar variant="sidebar">
			<SidebarHeader className={cn("text-2xl font-semibold", dmsans.className)}>
				<Link href={"/dashboard"}>AlgoAkhada</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarSeparator />
				<SidebarMenu>
					{MENU_ITEMS.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton asChild>
								<Link href={item.href}>
									<item.icon />
									<>{item.text}</>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<UserSignoutDropdown user={session?.user} />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

// <SidebarMenu>
// 	<SidebarMenuItem>
// 		<ThemeButton />
// 	</SidebarMenuItem>
// </SidebarMenu>;
