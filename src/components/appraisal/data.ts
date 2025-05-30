import { GenericInputProps } from "@/app/types";
import { FieldValues } from "react-hook-form";

export const appraisalInputData: GenericInputProps<FieldValues>[] = [
	{
		name: "objectives",
		label: "1. What were your objectives for last year, and what were the results?",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "accomplishments",
		label: "2. List down your major work accomplishments for last year.",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "difficulties",
		label: "3. List down any areas of difficulty you faced for last year, and anything you did to overcome them.",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "improve_performance",
		label: "4. What could be done to improve your performance in your current position by you and/or your manager?",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "goals",
		label: "5. Please share any career goals and aspirations that you may have.",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "suggestions",
		label: "6. Please provide any suggestions on training that can help add value.",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "year_objectives",
		label: "7. What are your objectives for this year?",
		type: "textarea",
		placeholder: "Tip here...",
	},
	{
		name: "performance",
		label: "8. How would rate your performance this past year and why?",
		type: "textarea",
		placeholder: "Tip here...",
	},
];
