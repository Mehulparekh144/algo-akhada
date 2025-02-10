import React from "react";
import { getProblemById } from "./actions";

interface ProblemDescriptionProps {
	problemId: string;
}

async function ProblemDescription({ problemId }: ProblemDescriptionProps) {
	const problem = await getProblemById(problemId);
	return (
		<div>
			<pre>{JSON.stringify(problem, null, 2)}</pre>
		</div>
	);
}

export default ProblemDescription;
