"use client";

import GenericInput from "@/components/forms/generic-inputs";
import { Button } from "@/components/ui/button";
import { AppraisalForm, AppraisalFormData } from "@/schemas/appraisal-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import StarRating from "../forms/star-rating";
import { appraisalInputData } from "./data";

export default function SelfAssessment() {
	const methods = useForm<AppraisalFormData>({
		resolver: zodResolver(AppraisalForm),
		defaultValues: {
			objectives: "",
			accomplishments: "",
			difficulties: "",
			improve_performance: "",
			goals: "",
			suggestions: "",
			year_objectives: "",
			performance: "",
			rating: "",
		},
	});

	const onSubmit = (data: AppraisalFormData) => {
		console.log("Formulário enviado:", data);
	};
	const handleRatingChange = (rating: number) => {
		console.log("Avaliação enviada:", rating);
	};

	return (
		<div className="rounded border p-4">
			<h2 className="mb-5 text-center text-xl">Self Assessment</h2>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					{appraisalInputData.map((input) => (
						<div key={input.name} className="relative w-full">
							<GenericInput
								key={input.name}
								name={input.name}
								label={input.label}
								type={input.type}
								placeholder={input.placeholder}
								options={input.options}
								labelClassName="text-md"
							/>
						</div>
					))}

					<StarRating onRatingChange={handleRatingChange} />

					<Button type="submit" className="w-full">
						Send
					</Button>
				</form>
			</FormProvider>
		</div>
	);
}
