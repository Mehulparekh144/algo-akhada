import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle2,
	XCircle,
	TrendingUp,
	Target,
	DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightsDisplayProps {
	insights: {
		patterns: string[];
		improvements: string[];
		successRate: string;
		progress: string;
	};
	summary: string;
	isPremium: boolean;
}

export function InsightsDisplay({
	insights,
	summary,
	isPremium,
}: InsightsDisplayProps) {
	const successRateNumber = Number.parseInt(insights.successRate);

	return (
		<Card className={"w-full relative bg-primary/5"}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Target className="h-5 w-5" />
					Your Coding Insights
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
				{/* Success Rate Section */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Success Rate</span>
						</div>
						<span className="text-2xl font-bold">{insights.successRate}</span>
					</div>
					<Progress value={successRateNumber} />
				</div>

				{/* Learning Progress Section */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Learning Progress</span>
					</div>
					<p className="text-sm text-muted-foreground">{insights.progress}</p>
				</div>

				{/* Patterns Section */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Target className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Coding Patterns</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{insights.patterns.map((pattern) => (
							<Badge key={pattern} variant="secondary" className="text-xs">
								{pattern}
							</Badge>
						))}
					</div>
				</div>

				{/* Improvements Section */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<XCircle className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Areas for Improvement</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{insights.improvements.map((improvement) => (
							<Badge key={improvement} variant="outline" className="text-xs">
								{improvement}
							</Badge>
						))}
					</div>
				</div>

				{/* Summary */}
				<div className="text-xs text-muted-foreground text-center pt-2 border-t">
					{summary}
				</div>
			</CardContent>
		</Card>
	);
}
