import { z } from "zod";

export const AppraisalForm = z.object({
	objectives: z.string().min(10, "Min. 10 caracteres"),
	accomplishments: z.string().min(10, "Min. 10 caracteres"),
	difficulties: z.string().min(10, "Min. 10 caracteres"),
	improve_performance: z.string().min(10, "Min. 10 caracteres"),
	goals: z.string().min(10, "Min. 10 caracteres"),
	suggestions: z.string().min(10, "Min. 10 caracteres"),
	year_objectives: z.string().min(10, "Min. 10 caracteres"),
	performance: z.string().min(10, "Min. 10 caracteres"),
	rating: z.string().min(1, "Selecione uma opção"),
});

export type AppraisalFormData = z.infer<typeof AppraisalForm>;
