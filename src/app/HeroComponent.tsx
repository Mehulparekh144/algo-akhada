"use client";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card, CardContent } from "@/components/ui/card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";
import {
	Calendar,
	Code,
	Globe,
	Layers,
	LineChart,
	LogIn,
	MessageSquare,
	Settings,
	TrendingUp,
	Users,
	Users2,
	Zap,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { HeroStepper } from "./(main)/HeroStepper";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HeroPill } from "@/components/ui/hero-pill";

const FEATURES = [
	{
		title: "Peer-to-Peer Practice",
		description: "Battle-test your algorithms with peers in real-time.",
		icon: <Users2 />,
	},
	{
		title: "Flexible Scheduling",
		description: "Book sessions that fit perfectly into your busy calendar.",
		icon: <Calendar />,
	},
	{
		title: "Customizable Difficulty",
		description: "Choose problem complexity that matches your skill level.",
		icon: <Layers />,
	},
	{
		title: "Instant Matching",
		description: "Connect with available peers for immediate practice.",
		icon: <Zap />,
	},
	{
		title: "Structured Feedback",
		description: "Exchange insights to strengthen your interview skills.",
		icon: <MessageSquare />,
	},
	{
		title: "Track Progress",
		description: "Monitor your improvement and growth over time.",
		icon: <LineChart />,
	},
	{
		title: "Community-Driven",
		description: "Learn from diverse coding styles and approaches.",
		icon: <Globe />,
	},
];

const CODE = `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        difference = target - num
        if difference in num_map:
            return [num_map[difference], i]
        num_map[num] = i
    return []
  `;

const STEPS = [
	{
		title: "Login",
		description: "Create your profile and set your expertise level",
		icon: <LogIn />,
	},
	{
		title: "Book an Akhada",
		description: "Select your available time slots and preferences",
		icon: <Calendar />,
	},
	{
		title: "Set Parameters",
		description: "Choose problem difficulty from novice to expert",
		icon: <Settings />,
	},
	{
		title: "Match",
		description: "Connect with peers or wait in the queue for your turn",
		icon: <Users />,
	},
	{
		title: "Practice",
		description: "Solve problems and receive real-time feedback",
		icon: <Code />,
	},
	{
		title: "Improve",
		description: "Track progress and schedule your next session",
		icon: <TrendingUp />,
	},
];

export default function HeroComponent() {
	const { theme } = useTheme();
	return (
		<div className="w-full min-h-screen flex flex-col items-center justify-center">
			<div className="relative w-full min-h-screen overflow-hidden bg-dot-pattern">
				{/* Spotlight effect */}
				<div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

				{/* Animated gradient blobs */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="absolute h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl animate-blob" />
					<div className="absolute h-[32rem] w-[32rem] rounded-full bg-secondary/20 blur-3xl animate-blob animation-delay-2000" />
					<div className="absolute h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl animate-blob animation-delay-4000" />
				</div>

				{/* Cubic grid pattern */}
				<div className="absolute inset-0">
					<div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
				</div>

				{/* Content */}
				<div className="relative flex flex-col h-screen items-center justify-center px-10 max-w-8xl md:max-w-6xl lg:max-w-4xl space-y-8 w-full mx-auto">
					<HeroPill
						href="" // TODO: Purchase link
						label="50% off on PRO for first 100 users"
						announcement="🎉 Discount"
						isExternal
					/>
					<div className="relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
						<h1 className="relative text-5xl md:text-6xl font-display lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 text-center">
							AlgoAkhada
						</h1>
					</div>

					<TextGenerateEffect
						className="text-muted-foreground text-center text-lg"
						words="Battle-Test Your Algorithms with Peers"
					/>

					<div className="flex flex-col items-center gap-6">
						<CallToActionButton text="Get Started" />
						<CodeSection code={CODE} theme={theme} />
					</div>
				</div>
			</div>

			{/* Features */}
			<div className="bg-primary-foreground border-t-2 border-b-2 w-full flex items-center justify-center min-h-screen">
				<div className="flex items-center h-full justify-center flex-col max-w-8xl md:max-w-7xl lg:max-w-6xl w-full py-10">
					<h2 className="text-3xl font-display md:text-4xl mt-12 font-bold">
						Why choose Algoakhada ?{" "}
					</h2>
					<p className="text-muted-foreground text-center max-w-lg py-4">
						Our platform offers everything you need to master technical
						interviews
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-4 relative z-10 py-10 mx-auto">
						{FEATURES.map((feature, index) => (
							<FeatureSection key={feature.title} {...feature} index={index} />
						))}
					</div>
				</div>
			</div>

			{/* Steps */}
			<div className="border-2 mt-auto w-full flex items-center justify-center ">
				<div className="flex flex-col items-center justify-between max-w-8xl md:max-w-7xl lg:max-w-6xl w-full px-4 py-14">
					<h2 className="text-3xl font-display md:text-4xl mt-12 font-bold">
						How It Works
					</h2>
					<p className="text-muted-foreground text-center max-w-lg py-4">
						Get started in minutes
					</p>
					<HeroStepper steps={STEPS} />
				</div>
			</div>

			{/* Footer */}
			<div className="bg-primary-foreground border-2 mt-auto w-full flex items-center justify-center ">
				<div className="flex flex-col md:flex-row items-center justify-between max-w-8xl md:max-w-7xl lg:max-w-6xl w-full px-4 py-10">
					{/* Left Section: Copyright */}
					<p className="text-muted-foreground">
						© 2025 AlgoAkhada. All rights reserved.
					</p>

					{/* Middle Section: Made with ❤️ and Built with */}
					<div className="flex flex-col items-center">
						<p className="text-muted-foreground text-center">
							Made with ❤️ by{" "}
							<Link
								href="https://mehulparekh.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								Mehul Parekh
							</Link>{" "}
							|{" "}
							<Link
								href="https://github.com/Mehulparekh144"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								GitHub
							</Link>
						</p>
						<p className="text-muted-foreground text-center mt-1">
							Built with <span className="font-bold">shadcn</span>,{" "}
							<span className="font-bold">Aceternity UI</span>, and{" "}
							<span className="font-bold">Next.js</span>.
						</p>
					</div>

					{/* Right Section: Fun Text */}
					<p className="text-muted-foreground">
						🚀 Turning coffee into code since 2023! ☕️
					</p>
				</div>
			</div>

			{/* Add these styles to your globals.css */}
			<style jsx global>{`
				.bg-dot-pattern {
					background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0);
					background-size: 24px 24px;
				}
				.dark .bg-dot-pattern {
					background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
				}
				@keyframes blob {
					0% { transform: translate(0, 0) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0, 0) scale(1); }
				}
				@keyframes gradient-xy {
					0% { background-size: 100% 100%; background-position: 0% 0%; }
					50% { background-size: 200% 200%; background-position: 100% 100%; }
					100% { background-size: 100% 100%; background-position: 0% 0%; }
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animate-gradient-xy {
					animation: gradient-xy 15s ease infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	);
}

interface CallToActionButtonProps {
	text: string;
}

function CallToActionButton({ text }: CallToActionButtonProps) {
	return (
		<Link
			href={"/dashboard"}
			className="bg-primary no-underline group cursor-pointer relative shadow-2xl shadow-primary-foreground rounded-full p-px text-xs font-semibold leading-6  text-white inline-block"
		>
			<span className="absolute inset-0 overflow-hidden rounded-full">
				<span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			</span>
			<div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
				<span>{text}</span>
				<svg
					fill="none"
					height="16"
					viewBox="0 0 24 24"
					width="16"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Arrow right"
					role="img"
				>
					<title>Arrow right</title>
					<path
						d="M10.75 8.75L14.25 12L10.75 15.25"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
					/>
				</svg>
			</div>
			<span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
		</Link>
	);
}

function FeatureSection({
	title,
	description,
	icon,
	index,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	index: number;
}) {
	return (
		<div
			className={cn(
				"flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
				(index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
				index < 4 && "lg:border-b dark:border-neutral-800",
			)}
		>
			{index < 4 && (
				<div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
			)}
			{index >= 4 && (
				<div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
			)}
			<div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
				{icon}
			</div>
			<div className="text-lg font-bold mb-2 relative z-10 px-10">
				<div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
				<span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
					{title}
				</span>
			</div>
			<p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
				{description}
			</p>
		</div>
	);
}
function CodeSection({
	code,
	theme,
}: {
	code: string;
	theme: string | undefined;
}) {
	return (
		<Card className="relative mx-16 z-10">
			{/* macOS-style buttons */}
			<div className="absolute top-2 right-2 flex space-x-2">
				<div className="w-3 h-3 bg-red-500 rounded-full" />
				<div className="w-3 h-3 bg-yellow-500 rounded-full" />
				<div className="w-3 h-3 bg-green-500 rounded-full" />
			</div>

			{/* Code content */}
			<CardContent className="pt-10">
				{" "}
				{/* Add padding-top to avoid overlap with buttons */}
				<SyntaxHighlighter
					wrapLines={true}
					language="python"
					style={theme === "dark" ? oneDark : oneLight}
				>
					{code}
				</SyntaxHighlighter>
			</CardContent>
		</Card>
	);
}
