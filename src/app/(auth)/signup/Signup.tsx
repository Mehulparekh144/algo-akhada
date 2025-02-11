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
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { signupSchema, SignupValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

export default function Signup() {
	const { toast } = useToast();
	const [loading, setLoading] = React.useState(false);
	const form = useForm<SignupValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	async function onSignup(data: SignupValues) {
		const { email, password, name } = data;
		await authClient.signUp.email(
			{
				email,
				password,
				name,
				callbackURL: "/signin",
			},
			{
				onError(context) {
					toast({
						title: "Error",
						description: context.error.message,
						variant: "destructive",
					});
					setLoading(false);
				},
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					window.location.href = "/signin";
					setLoading(false);
				},
			}
		);
	}

	return (
		<Card className="w-full md:mx-0 mx-4 md:w-1/3">
			<CardHeader>
				<CardTitle className="text-2xl">Sign up</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSignup)}
						className="space-y-3 mt-2"
					>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} type="text" placeholder="Jane Doe" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						<Button className="w-full" disabled={loading}>
							{loading && <Loader2 className="animate-spin" />}
							Sign up
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="text-sm text-muted-foreground">
				Already have an account ? &nbsp;{" "}
				<Link className="underline" href="/signin">
					{" "}
					Sign in
				</Link>
			</CardFooter>
		</Card>
	);
}
