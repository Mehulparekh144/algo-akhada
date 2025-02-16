import { UniqueProblem } from "@/lib/validations";
import React from "react";

interface TestCasesProps {
	problem: UniqueProblem;
}

export default function TestCases({ problem }: TestCasesProps) {
	return <div>{problem.exampleTestcases}</div>;
}
