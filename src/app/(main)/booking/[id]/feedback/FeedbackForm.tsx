"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { feedbackSchema, type FeedbackValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { completeBooking, provideFeedback } from "../actions";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
	bookingId: string;
	otherUser: User;
	currentUser: User;
}

const FeedbackForm = ({
	bookingId,
	otherUser,
	currentUser,
}: FeedbackFormProps) => {
	const { toast } = useToast();
	const form = useForm<FeedbackValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			rating: 3,
			didUserSolve: false,
			whatDidUserDoRight: "",
			whatDidUserDoWrong: "",
			howCanUserImprove: "",
			additionalComments: "",
		},
	});

	async function onSubmit(values: FeedbackValues) {
		try {
			await provideFeedback(bookingId, values, otherUser.id);
			await completeBooking(bookingId);

			toast({
				title: "Success",
				description: "Feedback submitted successfully!",
			});

			// Redirect to dashboard after successful submission
			window.location.href = "/dashboard";
		} catch (error) {
			console.error("Error submitting feedback:", error);
			toast({
				title: "Error",
				description: "Failed to submit feedback. Please try again.",
				variant: "destructive",
			});
		}
	}

	const ratingOptions = [
		{
			value: 1,
			label: "Terrible",
			icon: "😭",
		},
		{
			value: 2,
			label: "Bad",
			icon: "😟",
		},
		{
			value: 3,
			label: "Average",
			icon: "😐",
		},
		{
			value: 4,
			label: "Good",
			icon: "🙂",
		},
		{
			value: 5,
			label: "Excellent",
			icon: "🤩",
		},
	];

	return (
		<div>
			<Form {...form}>
				<form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="rating"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rate {otherUser.name}&apos;s performance</FormLabel>
								<div className="flex">
									{ratingOptions.map((option) => (
										<Button
											type="button"
											key={option.value}
											variant={
												field.value === option.value ? "secondary" : "outline"
											}
											size={"lg"}
											title={option.label}
											aria-label={option.label}
											onClick={() => field.onChange(option.value)}
											className="rounded-none first:rounded-l last:rounded-r text-lg"
										>
											{option.icon}
										</Button>
									))}
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="didUserSolve"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel>
									Did the {otherUser.name} solve the problem?
								</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<p className="text-sm text-muted-foreground">Yes</p>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="whatDidUserDoRight"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									What did the {otherUser.name} do right? ✅
								</FormLabel>
								<FormControl>
									<Textarea placeholder="Write something..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="whatDidUserDoWrong"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									What did the {otherUser.name} do wrong? ❌
								</FormLabel>
								<FormControl>
									<Textarea placeholder="Write something..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="howCanUserImprove"
						render={({ field }) => (
							<FormItem>
								<FormLabel>How can the {otherUser.name} improve? 🔧</FormLabel>
								<FormControl>
									<Textarea placeholder="Write something..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="additionalComments"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Additional comments</FormLabel>
								<FormControl>
									<Textarea placeholder="Write something..." {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						)}
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default FeedbackForm;
