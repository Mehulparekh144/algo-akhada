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
import { signupSchema, SignupValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface SignupProps {
	signup: (data: SignupValues) => void;
}

export default function Signup({ signup }: SignupProps) {
	const form = useForm<SignupValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	async function onSignup(data: SignupValues) {
		try {
			await signup(data);
			window.location.href = "/signin";
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "Failed to sign up",
				variant: "destructive",
			});
		}
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
						<Button className="w-full">Sign in</Button>
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
