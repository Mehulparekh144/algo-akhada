"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { loginSchema, LoginValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Signin() {
	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSignin(data: LoginValues) {
		try {
			await signIn("credentials", {
				email: data.email,
				password: data.password,
			});
			window.location.href = "/dashboard";
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Card className="w-full md:mx-0 mx-4 md:w-1/3">
			<CardHeader>
				<CardTitle className="text-2xl">Sign in</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSignin)}
						className="space-y-3 mt-2"
					>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="jane@mail.com"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormDescription>
										Password should be atleast 6 characters
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full">Sign in</Button>
					</form>
				</Form>
				<div className="relative py-4">
					<Separator />
					<p className="text-muted-foreground absolute left-1/2 top-1/2 -translate-x-1/2 bg-background -translate-y-1/2 text-xs">
						OR
					</p>
				</div>
				<Button
					variant={"secondary"}
					onClick={() => signIn("github")}
					className="w-full"
					type="button"
				>
					Sign in with Github <GithubIcon />
				</Button>
			</CardContent>
			<CardFooter className="text-sm text-muted-foreground">
				Don't have an account? &nbsp;{" "}
				<Link className="underline" href="/signup">
					{" "}
					Sign up
				</Link>
			</CardFooter>
		</Card>
	);
}
