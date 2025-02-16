import React from "react";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";
import { Problem } from "@prisma/client";

interface ProblemDescriptionProps {
	problem: Problem;
}

const difficultyMap = {
	Easy: "bg-green-500 text-white dark:bg-green-700",
	Medium: "bg-yellow-500 text-white dark:bg-yellow-700",
	Hard: "bg-red-500 text-white dark:bg-red-700",
};

// TODO - Have a tab group for description and hints
async function ProblemDescription({ problem }: ProblemDescriptionProps) {
	return (
		<div className="h-full p-4 overflow-auto border-r-2">
			<h1 className="text-xl font-semibold">{problem.title}</h1>
			<span
				className={cn(
					"text-sm py-1 my-2 px-4 rounded-md inline-block",
					difficultyMap[problem.difficulty]
				)}
			>
				{problem.difficulty}
			</span>
			<Separator className="my-2" />
			<div className="">{parse(problem.question ?? "")}</div>
			{/* <pre>{JSON.stringify(problem, null, 2)}</pre> */}
		</div>
	);
}

export default ProblemDescription;
