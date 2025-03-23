import * as React from "react";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import {
	getProblemsSolved,
	fetchUserFeedbackInsights,
	generateLearningPath,
} from "./actions";
import ProblemsSolved from "./ProblemsSolved";
import { LearningPath } from "./LearningPath";
import { InsightsDisplay } from "./InsightsDisplay";

const breadcrumbs = [
	{
		label: "Dashboard",
		href: "/dashboard",
	},
];

export default async function StatsPage() {
	const isPremium = false; // TODO: remove this
	const stats = await getProblemsSolved();
	const { insights, summary } = await fetchUserFeedbackInsights(isPremium);
	const learningPath = await generateLearningPath(isPremium);

	return (
		<div className="w-full h-screen mx-auto px-4 py-4 md:py-8">
			<CustomBreadcrumbs breadcrumbs={breadcrumbs} currentPage="Stats" />
			<div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4">
				<ProblemsSolved stats={stats} />
				<InsightsDisplay
					insights={insights}
					summary={summary}
					isPremium={isPremium}
				/>
				<LearningPath
					currentLevel={learningPath.currentLevel}
					nextSteps={learningPath.nextSteps}
					recommendedTopics={learningPath.recommendedTopics}
					difficultyProgress={learningPath.difficultyProgress}
					summary={learningPath.summary}
					isPremium={isPremium}
				/>
			</div>
		</div>
	);
}
