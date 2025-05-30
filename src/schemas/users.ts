import { isFinite, isNumber } from "lodash";
import { z } from "zod";

export const userSchema = z.object({
	id: z.number().int().optional(),
	username: z.string().max(255).email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(255)
		.optional()
		.or(z.literal("")),
	name: z
		.string()
		.max(255)
		.min(1, "Name is required")
		.min(5, "Name must have at least 5 characters"),
	display_name: z.string().max(255),
	admission_date: z.preprocess((arg) => {
		if (typeof arg === "string" || arg instanceof Date) {
			return new Date(arg);
		}
		return arg;
	}, z.date()),
	role: z.string().max(255),
	department: z.preprocess((arg) => {
		if (
			typeof arg === "string" &&
			isNumber(Number(arg)) &&
			isFinite(Number(arg))
		) {
			return parseInt(arg, 10);
		}
		return arg;
	}, z.number().int()),
	hp_registration: z.preprocess((arg) => {
		if (
			typeof arg === "string" &&
			isNumber(Number(arg)) &&
			isFinite(Number(arg))
		) {
			return parseInt(arg);
		}
		return arg;
	}, z.number().int()),
	direct_manager: z.preprocess((arg) => {
		if (
			typeof arg === "string" &&
			isNumber(Number(arg)) &&
			isFinite(Number(arg))
		) {
			return parseInt(arg);
		}
		return arg;
	}, z.number().int()),
});
