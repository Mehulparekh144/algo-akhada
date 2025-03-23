import React from "react";
import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { getFeedbacks } from "./actions";
import FeedbacksTable from "./FeedbacksTable";
import vector from "@/assets/images/nohints.png";
import Image from "next/image";

const breadcrumbs = [
	{
		href: "/dashboard",
		label: "Dashboard",
	},
];

const FeedbackPage = async () => {
	const feedbacks = await getFeedbacks();

	return (
		<div className="w-full h-screen mx-auto px-4 py-4 md:py-8">
			<CustomBreadcrumbs breadcrumbs={breadcrumbs} currentPage="Feedbacks" />
			<h1 className="text-2xl font-bold font-display mt-4">Your Feedbacks</h1>
			{feedbacks.length > 0 ? (
				<FeedbacksTable feedbacks={feedbacks} />
			) : (
				<div className="flex items-center justify-start flex-col gap-4">
					<Image
						className="w-2/5 dark:filter dark:invert"
						src={vector}
						alt="No feedbacks found"
					/>
					<p className="text-muted-foreground">No feedbacks found</p>
				</div>
			)}
		</div>
	);
};

export default FeedbackPage;
