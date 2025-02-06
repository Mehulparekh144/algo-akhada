import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { PT_Sans } from "next/font/google";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

const ptsans = PT_Sans({
	subsets: ["latin"],
	weight: "400",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ptsans.className}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
