"use client";

import GenericInput from "@/components/forms/generic-inputs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	EnquiryRequestFormData,
	EnquiryRequestFormSchema,
} from "@/schemas/erf";
import { zodResolver } from "@hookform/resolvers/zod";
import assert from "assert";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { erfInputData } from "./InputData";

type EnquiryRequestPayload = Omit<
	EnquiryRequestFormData,
	"received_date" | "estimated_quote_date" | "expected_start_date"
> & {
	received_date: string;
	estimated_quote_date: string;
	expected_start_date: string;
};

const ErfCardComponent = memo(function ErfCardComponent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Card className={`gap-2 px-4 py-3 ${className ?? ""}`}>{children}</Card>
	);
});

export default function EnquiryRequestForm() {
	const methods = useForm<EnquiryRequestFormData>({
		resolver: zodResolver(EnquiryRequestFormSchema),
		defaultValues: {
			enquiry_source: "EMAIL",
			request_file: undefined,
			description: "",
			client_name: "",
			division: "",
			client_contact_name: "",
			client_email: "",
			invoicing_address: "",
			avantis_station: undefined,
			avantis_services: undefined,
			requester: "",
			estimated_quote_date: undefined,
			expected_start_date: undefined,
			expected_duration: 0,
			probability_award: undefined,
			comments: "",
			general_operations_manager: "",
			client_interface: "",
			vessel_site: "",
		},
	});

	const router = useRouter();
	const saveDraft = () => {
		const data = methods.getValues();
		const validate = EnquiryRequestFormSchema.safeParse(data); // Validate the data against the schema
		if (!validate.success) {
			const errors = validate.error.format();
			throw new Error("Validation failed: " + JSON.stringify(errors));
		}
		const json = JSON.stringify(data, null, 4);
		localStorage.setItem("enquiryRequest", json);
	};

	const onSubmit = async (data: EnquiryRequestFormData) => {
		const payload: Record<string, string | number | Date> = {
			...data,
			received_date: format(data.received_date!, "yyyy-MM-dd"),
			estimated_quote_date: format(
				data.estimated_quote_date!,
				"yyyy-MM-dd",
			),
			expected_start_date: format(
				data.expected_start_date!,
				"yyyy-MM-dd",
			),
		};

		erfInputData.forEach((input) => {
			if (input.type === "select") {
				const selected = (input.options ?? []).find(
					(opt) =>
						opt.value ===
						data[input.name as keyof EnquiryRequestFormData],
				);
			}
		});
		try {
			saveDraft();
		} catch (error) {
			assert(error instanceof Error);
			toast.error("Error: ", {
				description: error.message,
			});
			return;
		}

		router.push("/i/commercial/auto-budget");
	};

	const displayFormErrors = (error: Record<string, { message: string }>) => {
		const errorMessages = Object.values(error).map((err) => err.message);
		return `${errorMessages.join(`, `)}`;
	};

	return (
		<div className="mb-2 p-0">
			<h2 className="mb-4 text-center text-xl md:text-3xl">
				Enquiry Request Form
			</h2>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit, (error) =>
						toast.error("Form errors:", {
							description: displayFormErrors(
								error as Record<string, { message: string }>,
							),
						}),
					)}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
						<ErfCardComponent className="lg:rounded-bl-none lg:rounded-br-none lg:rounded-tr-none">
							{erfInputData.slice(0, 4).map((input) => (
								<GenericInput key={input.name} {...input} />
							))}
						</ErfCardComponent>
						<ErfCardComponent className="lg:rounded-bl-none lg:rounded-br-none lg:rounded-tl-none">
							{erfInputData.slice(4, 8).map((input) => (
								<GenericInput key={input.name} {...input} />
							))}
						</ErfCardComponent>
						<ErfCardComponent className="lg:rounded-br-none lg:rounded-tl-none lg:rounded-tr-none">
							{erfInputData.slice(8, 14).map((input) => (
								<GenericInput key={input.name} {...input} />
							))}
						</ErfCardComponent>
						<ErfCardComponent className="lg:rounded-bl-none lg:rounded-tl-none lg:rounded-tr-none">
							{erfInputData.slice(14).map((input) => (
								<GenericInput key={input.name} {...input} />
							))}
						</ErfCardComponent>
					</div>

					<ErfCardComponent className="flex justify-between">
						<Button
							type="button"
							variant="outline"
							className="text-sm"
							onClick={() => methods.reset()}
						>
							Clear <RefreshCw />
						</Button>
						<div className="flex items-end justify-end gap-2">
							{/* <Button
								type="button"
								variant="secondary"
								className="text-sm"
								onClick={() => saveDraft()}
							>
								Save Draft
							</Button> */}
							<Button
								type="submit"
								className="text-sm text-white"
							>
								Next
							</Button>
						</div>
					</ErfCardComponent>
					{/* <Button
						size={"sm"}
						type="button"
						variant="outline"
						className="text-md px-12"
						onClick={preencherFormulario}
					>
						Auto Fill
					</Button> */}
				</form>
			</FormProvider>
		</div>
	);
}
