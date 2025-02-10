"use client";
import { Separator } from "@/components/ui/separator";
import { problemSchema, ProblemValues } from "@/lib/validations";
import React from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function SubmitForm() {
	const form = useForm<ProblemValues>({
		resolver: zodResolver(problemSchema),
		defaultValues: {
			title: "",
			description: "",
			difficulty: "easy",
			testcases: [],
			timeLimit: 1,
			constraints: "",
		},
	});

	function onSubmit(data: ProblemValues) {
		console.log(data);
	}

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "testcases",
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="h-full flex flex-col"
			>
				<div className="flex-grow grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-6 overflow-hidden">
					{/* First Column */}
					<div className="flex flex-col p-2 space-y-4 overflow-y-auto pr-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex-grow flex flex-col">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter description"
											className="flex-grow resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Second Column */}
					<div className="flex flex-col p-2 space-y-4">
						<FormField
							control={form.control}
							name="difficulty"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Difficulty</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select difficulty" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="easy">Easy</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="hard">Hard</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="timeLimit"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time Limit (ms) </FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											onChange={(e) => field.onChange(+e.target.value)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="constraints"
							render={({ field }) => (
								<FormItem className="flex-grow flex flex-col">
									<FormLabel>Constraints</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter constraints"
											className="flex-grow resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Third Column */}
					<div className="flex flex-col p-2 space-y-4 overflow-y-auto pr-4">
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => append({ input: "", output: "" })}
						>
							Add Test Case
						</Button>
						<Label className="text-xs text-muted-foreground">
							Multiple inputs and outputs should be seperated by newline
						</Label>
						{fields.map((field, index) => (
							<TestcaseItem
								key={field.id}
								index={index}
								onRemove={() => remove(index)}
								register={form.register}
							/>
						))}
					</div>
				</div>

				{/* Fourth Part (Submit Button) */}
				<div className="p-4 shadow-lg border-t-2 ">
					<Button type="submit" size={"lg"} className="float-end">
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}

interface TestcaseItemProps {
	index: number;
	onRemove: () => void;
	register: any;
}

function TestcaseItem({ index, onRemove, register }: TestcaseItemProps) {
	return (
		<div className="space-y-2 border p-4 rounded-md relative">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-2 right-2"
				onClick={onRemove}
			>
				<X className="h-4 w-4" />
			</Button>
			<Label htmlFor={`testCases.${index}.input`}>Input</Label>
			<Textarea
				id={`testCases.${index}.input`}
				{...register(`testCases.${index}.input`)}
				className="resize-none h-20"
			/>
			<Label htmlFor={`testCases.${index}.output`}>Output</Label>
			<Textarea
				id={`testCases.${index}.output`}
				{...register(`testCases.${index}.output`)}
				className="resize-none h-20"
			/>
		</div>
	);
}
