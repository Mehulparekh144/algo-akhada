import type React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

async function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger className="absolute z-10 top-0 left-0 opacity-20 hover:opacity-100 transition-opacity" />
			<div className="w-screen max-h-screen">{children}</div>
		</SidebarProvider>
	);
}
export default DashboardLayout;
