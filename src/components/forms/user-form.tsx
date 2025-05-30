import AuthClient from "@/infra/auth-client";
import { clientEnv } from "@/lib/constants/config";
import { userSchema } from "@/schemas/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

type UserFormData = z.infer<typeof userSchema>;

interface Props {
	user?: UserFormData;
}

const formItemClass = "flex justify-center items-center gap-2 p-2 space-y-0 2";
const formLabelClass = "w-1/4";

const defaultUserValues: Partial<UserFormData> = {
	username: "",
	name: "",
	display_name: "",
	role: "",
};

const UserForm = ({ user }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<UserFormData>({
		defaultValues: user || defaultUserValues,
		resolver: zodResolver(userSchema),
	});

	async function onSubmit(values: z.infer<typeof userSchema>) {
		setIsSubmitting(true);
		let endpoint;
		const body = JSON.stringify(values);
		const fetchOptions = {
			method: "",
			body,
		};
		if (user) {
			endpoint = `${clientEnv.NEXT_PUBLIC_URL}/api/users/${user.id}`;
			fetchOptions.method = "PATCH";
		} else {
			endpoint = `${clientEnv.NEXT_PUBLIC_URL}/api/users`;
			fetchOptions.method = "POST";
		}
		const response = await AuthClient(endpoint, fetchOptions);
		if (response.ok) {
			toast.success(`${user ? "Update" : "Create"} successfully!`);
			queryClient.invalidateQueries({
				queryKey: ["users"],
			});
		} else {
			toast.error(`Failed to ${user ? "update" : "create"} user.`, {
				description: response.statusText,
			});
		}
		setIsSubmitting(false);
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (errors) => {
						if (Object.keys(errors).length > 0) {
							for (const key in errors) {
								const error = key as keyof typeof errors;
								if (errors[error]?.message) {
									const message = `${error}: ${errors[error].message}`;
									console.error(message);
									toast.error(message);
								}
							}
						}
					})}
				>
					<div className="flex flex-col gap-2">
						{user && (
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem className={formItemClass}>
										{user && (
											<FormLabel
												className={formLabelClass}
											>
												ID
											</FormLabel>
										)}
										<FormControl>
											<Input
												{...field}
												placeholder="id..."
												value={field.value}
												disabled={true}
											></Input>
										</FormControl>
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name="hp_registration"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											User Registration
										</FormLabel>
									)}
									<FormControl>
										<Input
											{...field}
											placeholder="User Registration..."
											value={field.value ?? ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											Email
										</FormLabel>
									)}
									<FormControl>
										<Input
											className="m-0"
											placeholder="Username..."
											{...field}
											value={field.value || ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											Full Name
										</FormLabel>
									)}
									<FormControl>
										<Input
											{...field}
											placeholder="Full Name..."
											value={field.value ?? ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="display_name"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											Display Name
										</FormLabel>
									)}
									<FormControl>
										<Input
											{...field}
											placeholder="Display Name..."
											value={field.value ?? ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="admission_date"
							render={({ field }) => {
								const dateValue = field.value
									? new Date(field.value)
											.toISOString()
											.split("T")[0]
									: "";
								return (
									<FormItem className={formItemClass}>
										<FormLabel className={formLabelClass}>
											Admission Date
										</FormLabel>
										<FormControl>
											<Input
												className="cursor-pointer"
												type="date"
												placeholder="Admission Date..."
												{...field}
												value={dateValue}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									<FormLabel className={formLabelClass}>
										Role
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Role..."
											value={field.value ?? ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="department"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											Department
										</FormLabel>
									)}
									<FormControl>
										<Input
											{...field}
											placeholder="Department..."
											type="number"
											value={
												field.value
													? field.value.toString()
													: ""
											}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="direct_manager"
							render={({ field }) => (
								<FormItem className={formItemClass}>
									{user && (
										<FormLabel className={formLabelClass}>
											Manager
										</FormLabel>
									)}
									<FormControl>
										<Input
											{...field}
											placeholder="Direct Manager..."
											type="number"
											value={field.value ?? ""}
										></Input>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className={formItemClass}>
							<Button
								className="w-full"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<Loader2 className="animate-spin" />
								) : user ? (
									"Edit"
								) : (
									"Submit"
								)}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default UserForm;
