import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getUser } from "@/app/actions";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

async function DashboardLayout({ children }: DashboardLayoutProps) {
	const server = getUser();
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger className="absolute z-10 top-0 left-0 opacity-20 hover:opacity-100 transition-opacity" />
			<div className="w-screen h-[calc(100vh-20px)] pb-2 flex">{children}</div>
		</SidebarProvider>
	);
}

export default DashboardLayout;
