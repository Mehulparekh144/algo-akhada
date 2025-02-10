import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toast, ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

const inter = Inter({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ToastProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<SessionProvider>{children}</SessionProvider>
						<Toast />
					</ThemeProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
