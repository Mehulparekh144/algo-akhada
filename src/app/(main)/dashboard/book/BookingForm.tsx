"use client";
import { DatePicker } from "@/components/date-picker";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { bookingSchema, type BookingValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { createBooking, getValidTimes } from "./actions";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "date-fns";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function BookingForm() {
	const form = useForm<BookingValues>({
		resolver: zodResolver(bookingSchema),
	});

	const [validTimes, setValidTimes] = React.useState<Date[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [submitLoading, setSubmitLoading] = React.useState(false);

	useEffect(() => {
		const { unsubscribe } = form.watch(async (values) => {
			try {
				const { date } = values;
				if (date) {
					setLoading(true);
					const times = await getValidTimes(date);
					setValidTimes(times);
				}
			} catch (error) {
				console.error(error);
				toast({
					title: "Error",
					description: "Failed to fetch available times.",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		});
	}, [form]);

	async function handleSubmit(values: BookingValues) {
		try {
			setSubmitLoading(true);
			await createBooking(values);
			window.location.href = "/dashboard";
		} catch (error) {
			toast({
				title: error instanceof Error ? error.message : "Error",
				description:
					error instanceof Error
						? error.message.includes("pending feedback")
							? "Please complete your pending feedbacks before booking new sessions."
							: "Failed to create booking."
						: "Failed to create booking.",
				variant: "destructive",
			});
		} finally {
			setSubmitLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<DatePicker
									date={field.value}
									setDate={field.onChange}
									minDate={new Date()}
									loading={loading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{validTimes.length > 0 && (
					<div className="space-y-2">
						<Label>Available Times</Label>
						<div className="flex flex-wrap gap-2 items-center">
							{validTimes.map((time) => (
								<Button
									variant={
										form.getValues().startTime === time.toISOString()
											? "default"
											: "secondary"
									}
									type="button"
									onClick={() => form.setValue("startTime", time.toISOString())}
									key={time.toISOString()}
								>
									{formatDate(time, "HH:mm a")}
								</Button>
							))}
						</div>
					</div>
				)}
				<FormField
					control={form.control}
					name="difficulty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Difficulty</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a difficulty" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="NOVICE">Novice</SelectItem>
									<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
									<SelectItem value="EXPERT">Expert</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>Choose the difficulty level.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="space-y-3" disabled={submitLoading}>
					{submitLoading ? (
						<>
							<Loader2 className="animate-spin" /> Submitting
						</>
					) : (
						<>Submit</>
					)}
				</Button>
			</form>
		</Form>
	);
}
