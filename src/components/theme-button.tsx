"use client";
import { useTheme } from "next-themes";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

function ThemeButton() {
	const { theme, setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center w-full gap-3 justify-between">
				{theme === "dark" ? (
					<>
						<Moon /> Dark{" "}
					</>
				) : (
					<>
						<Sun /> Light{" "}
					</>
				)}
				Theme
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Button
						variant={"ghost"}
						className="w-full"
						onClick={() => setTheme("light")}
					>
						Light
					</Button>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Button
						variant={"ghost"}
						className="w-full"
						onClick={() => setTheme("dark")}
					>
						Dark
					</Button>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Button
						variant={"ghost"}
						className="w-full"
						onClick={() => setTheme("system")}
					>
						System
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default ThemeButton;
