"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientEnv } from "@/lib/constants/config";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().min(1, { message: "This field has to be filled." }),
	password: z
		.string()
		.min(1, { message: "This field has to be filled." })
		.min(4)
		.max(64),
	keepLogin: z.boolean().default(false),
});

export function LoginForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState<string>("");

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has("error")) {
			setError(searchParams.get("error") || "");
			toast.warning("Error", {
				description: error.toUpperCase(),
			});
		}
	}, [error]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const credentials = {
			email: values.email,
			password: values.password,
			redirect: false,
			callbackUrl: clientEnv.NEXT_PUBLIC_URL, // change this later
		};
		await signIn("credentials", credentials).then((res) => {
			if (res) {
				const { ok, status } = res;
				if (ok) {
					toast.success("Login successful", {
						description: "Welcome!",
					});
					redirect("/");
				}

				let msg = "";
				if (status === 401) {
					msg = "Invalid email or password";
				} else {
					msg = "Something went wrong. Try Again Later.";
				}
				toast.error("Login failed", {
					description: msg,
					action: {
						label: "Dismiss",
						onClick: () => console.log("Dismiss"),
					},
					duration: 5000,
				});
			}
		});
		setIsLoading(false);
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<div className={cn("grid gap-1", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-5">
						<div className="grid gap-1">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="email@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2"></div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<p> Login </p>
							)}
						</Button>
						{/* <div className="flex items-center space-x-2">
							<Checkbox id="terms" />
							<label
								htmlFor="terms"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Remember-me
							</label>
						</div> */}
					</div>
				</form>
			</Form>
			<div className="relative mt-2">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						<a
							className="bold text-blue-600"
							href={`${clientEnv.NEXT_PUBLIC_URL}/auth/forgot-password`}
						>
							Forgot Password ?
						</a>
					</span>
				</div>
			</div>
		</div>
	);
}
