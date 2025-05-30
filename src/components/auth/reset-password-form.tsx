"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clientEnv } from "@/lib/constants/config";
import { redirect } from "next/navigation";

interface Props {
	className?: string;
	token?: string;
}

const formSchema = z
	.object({
		newPassword: z.string().min(8),
		confirmPassword: z.string().min(8),
		token: z
			.string()
			.min(
				1,
				"Try to recover password again by clicking on the email link.",
			),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const ResetPasswordForm = ({ className, token, ...props }: Props) => {
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const response = await fetch(
			`${clientEnv.NEXT_PUBLIC_URL}/api/auth/reset-password`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			},
		);

		const data = await response.json();
		if (!response.ok) {
			toast.error(data.message);
			setIsLoading(false);
		}

		toast.success(data.message);
		setIsLoading(false);
		redirect(`${clientEnv.NEXT_PUBLIC_URL}/auth/signin`);
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
			token,
		},
	});

	return (
		<div className={cn("grid gap-1", className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-5">
						<div className="grid gap-1">
							<FormField
								name="newPassword"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type="password"
												placeholder="New password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="confirmPassword"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm new password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="token"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl className="hidden">
											<Input type="hidden" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-1">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<p>Recover Password</p>
								)}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ResetPasswordForm;
