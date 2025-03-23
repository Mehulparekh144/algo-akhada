import { cn } from "@/lib/utils";

interface DotBackgroundProps {
	className?: string;
}

export function DotBackground({ className }: DotBackgroundProps) {
	return (
		<div
			className={cn(
				"absolute inset-0 w-full h-full dark:opacity-30 opacity-50",
				className,
			)}
			style={{
				backgroundImage:
					"radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
				backgroundSize: "40px 40px",
			}}
			aria-hidden="true"
		/>
	);
}
