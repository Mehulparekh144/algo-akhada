"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
	date?: Date;
	setDate: (date?: Date) => void;
	minDate?: Date;
	loading?: boolean;
}

export function DatePicker({
	date,
	setDate,
	minDate,
	loading,
}: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
					disabled={loading}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{loading && <Loader2 className="animate-spin" />}
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
					disabled={(date) => date < (minDate || new Date())}
				/>
			</PopoverContent>
		</Popover>
	);
}
