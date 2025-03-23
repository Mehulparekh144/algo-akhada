import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonColorfulProps extends ButtonProps {
	children?: React.ReactNode;
}

function ButtonColorful({
	className,
	children,
	...props
}: ButtonColorfulProps) {
	return (
		<Button
			className={cn(
				"relative h-10 px-4 overflow-hidden",
				"bg-zinc-900 dark:bg-zinc-100",
				"transition-all duration-200",
				"group",
				className,
			)}
			{...props}
		>
			{/* Gradient background effect */}
			<div
				className={cn(
					"absolute inset-0",
					"bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
					"opacity-40 group-hover:opacity-80",
					"blur transition-opacity duration-500",
				)}
			/>

			{/* Content */}
			<div className="relative flex items-center justify-center gap-2">
				{children}
			</div>
		</Button>
	);
}

export { ButtonColorful };
