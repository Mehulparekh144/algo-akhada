"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function TimedAlert() {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Alert
			variant="destructive"
			className={`absolute bottom-2 right-2 w-max z-10 ${show ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
		>
			<AlertTriangle className="w-4 h-4" />
			<AlertTitle>Important</AlertTitle>
			<AlertDescription>
				If not provided feedback, you will not be able to book again.
			</AlertDescription>
		</Alert>
	);
}
