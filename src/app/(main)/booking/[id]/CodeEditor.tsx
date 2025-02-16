"use client";
import React from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Play } from "lucide-react";

const AVAILABLE_LANGUAGES = [
	"javascript",
	"typescript",
	"java",
	"cpp",
	"python",
	"csharp",
	"ruby",
	"swift",
	"go",
	"rust",
	"php",
	"perl",
	"lua",
	"shell",
	"sql",
	"plaintext",
];

export default function CodeEditor() {
	const { theme } = useTheme();
	const [language, setLanguage] = React.useState("javascript");
	return (
		<div className="w-full h-full">
			<div className="m-2 flex gap-2 items">
				<Select>
					<SelectTrigger>
						<SelectValue placeholder={`Select a language (${language})`} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{AVAILABLE_LANGUAGES.map((lang) => (
								<SelectItem
									value={lang}
									key={lang}
									onClick={() => setLanguage(lang)}
								>
									{lang}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button variant={"secondary"} size={"sm"}>
					<Play /> Run
				</Button>
				<Button size={"sm"}>
					<CheckCircle2 />
					Submit
				</Button>
			</div>
			<div className="w-full h-full">
				<Editor
					defaultLanguage={language}
					theme={theme === "dark" ? "vs-dark" : "light"}
				/>
			</div>
		</div>
	);
}
