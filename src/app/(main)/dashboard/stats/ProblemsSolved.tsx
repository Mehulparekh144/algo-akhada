"use client";

import React from "react";
import { Check, TrendingUp, AlertCircle } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Alert, AlertDescription } from "@/components/ui/alert";

const chartConfig = {
	solved: {
		label: "Solved",
		color: "hsl(var(--chart-1))",
	},
	total: {
		label: "Total",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const ProblemsSolved = ({
	stats,
}: {
	stats: {
		problemsSolved: number;
		pendingBookings: number;
		totalBookings: number;
	};
}) => {
	const chartData = [
		{
			name: "solved",
			value: stats.problemsSolved,
			fill: "hsl(var(--chart-1))",
		},
		{
			name: "total",
			value: stats.totalBookings,
			fill: "hsl(var(--chart-3))",
		},
	];

	return (
		<Card className="flex bg-primary/5 flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Problems Solved</CardTitle>
				<CardDescription>Your problem-solving progress</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{stats.problemsSolved.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Solved
												</tspan>
											</text>
										);
									}
									return null;
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					{Math.round((stats.problemsSolved / stats.totalBookings) * 100)}%
					completion rate
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					{stats.problemsSolved} out of {stats.totalBookings} total problems
				</div>
				{stats.pendingBookings > 0 && (
					<Alert variant="warning" className="mt-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{stats.pendingBookings} problem
							{stats.pendingBookings === 1 ? "" : "s"} pending feedback. These
							will be updated soon.
						</AlertDescription>
					</Alert>
				)}
			</CardFooter>
		</Card>
	);
};

export default ProblemsSolved;
