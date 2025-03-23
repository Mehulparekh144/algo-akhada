import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	GraduationCap,
	Target,
	BookOpen,
	TrendingUp,
	DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LearningPathProps {
	currentLevel: string;
	nextSteps: string[];
	recommendedTopics: string[];
	difficultyProgress: {
		easy: number;
		medium: number;
		hard: number;
	};
	summary: string;
	isPremium: boolean;
}

export function LearningPath({
	currentLevel,
	nextSteps,
	recommendedTopics,
	difficultyProgress,
	summary,
	isPremium,
}: LearningPathProps) {
	return (
		<Card className="relative bg-primary/5">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<GraduationCap className="h-5 w-5" />
					Your Learning Path
				</CardTitle>
			</CardHeader>
			{!isPremium && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
					<Button variant="default">
						Upgrade to Premium <DollarSign className="w-4 h-4" />
					</Button>
				</div>
			)}
			<CardContent
				className={`space-y-6 ${isPremium ? "filter-none" : "filter blur-lg"}`}
			>
				{/* Current Level */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Target className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Current Level</span>
					</div>
					<Badge variant="default" className="text-sm">
						{currentLevel}
					</Badge>
				</div>

				{/* Difficulty Progress */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Difficulty Progress</span>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-xs">Easy</span>
							<span className="text-xs">{difficultyProgress.easy}%</span>
						</div>
						<Progress value={difficultyProgress.easy} className="h-1" />

						<div className="flex items-center justify-between">
							<span className="text-xs">Medium</span>
							<span className="text-xs">{difficultyProgress.medium}%</span>
						</div>
						<Progress value={difficultyProgress.medium} className="h-1" />

						<div className="flex items-center justify-between">
							<span className="text-xs">Hard</span>
							<span className="text-xs">{difficultyProgress.hard}%</span>
						</div>
						<Progress value={difficultyProgress.hard} className="h-1" />
					</div>
				</div>

				{/* Next Steps */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Target className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Next Steps</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{nextSteps.map((step) => (
							<Badge key={step} variant="secondary" className="text-xs">
								{step}
							</Badge>
						))}
					</div>
				</div>

				{/* Recommended Topics */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<BookOpen className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Recommended Topics</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{recommendedTopics.map((topic) => (
							<Badge key={topic} variant="outline" className="text-xs">
								{topic}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
