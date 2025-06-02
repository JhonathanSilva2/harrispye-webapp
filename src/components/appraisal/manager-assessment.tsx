"use client";

import GenericInput from "@/components/forms/generic-inputs";
import { AppraisalForm, AppraisalFormData } from "@/schemas/appraisal-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import StarRating from "../forms/star-rating";
import { appraisalInputData } from "./data";

export default function ManagerAssessment() {
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
            <div className="grid grid-cols-2 p-5 px-10 text-sm">
                <h2 className="mb-5 text-start text-xl">Avaliação Gerencial</h2>
                <h2 className="mb-5 text-end text-xl text-muted-foreground">
                    Manager Assessment
                </h2>
            </div>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {appraisalInputData.map((input, index) => (
                        <div key={input.name} className="relative w-full">
                            <div className="text-md grid min-h-[50px] grid-cols-2 items-end">
                                <div className="text-md text-muted-foreground">
                                    Comentários
                                </div>
                                <div className="text-end">Comments</div>
                            </div>
                            <span className="absolute left-3 top-1/2 mt-4 -translate-y-1/2 transform border-r-2 pr-2 font-bold">
                                {index + 1}
                            </span>
                            <GenericInput
                                name={input.name}
                                type={input.type}
                                placeholder={input.placeholder}
                                options={input.options}
                                className="w-full pl-9"
                                disabled={true}
                                labelClassName="text-md"
                            />
                        </div>
                    ))}
                    <StarRating onRatingChange={handleRatingChange} />
                </form>
            </FormProvider>
        </div>
    );
}
