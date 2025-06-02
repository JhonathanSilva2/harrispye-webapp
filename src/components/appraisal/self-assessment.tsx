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
            <div className="grid grid-cols-2 p-5 px-10 text-sm">
                <h2 className="mb-5 text-start text-xl">Self Assessment</h2>
                <h2 className="mb-5 text-end text-xl text-muted-foreground">
                    Select Employee
                </h2>
            </div>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {appraisalInputData.map((input) => (
                        <div key={input.name} className="relative w-full">
                            <div className="grid min-h-[50px] grid-cols-2 items-end">
                                <div className="">{input.label2}</div>
                                <div className="text-end text-xs text-muted-foreground">
                                    {input.label}
                                </div>
                            </div>
                            <GenericInput
                                key={input.name}
                                name={input.name}
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
