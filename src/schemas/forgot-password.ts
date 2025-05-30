import { z } from "zod";

export const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

export const resetPasswordSchema = z.object({
	newPassword: z.string().min(8),
	confirmPassword: z.string().min(8),
	token: z.string(),
});
