import { GenericInputProps } from "@/app/types";
import { FieldValues } from "react-hook-form";
export const erfInputData: GenericInputProps<FieldValues>[] = [
	{
		name: "enquiry_source",
		label: "Enquiry Source:",

		placeholder: "Choose an item...",
		type: "select",

		options: [
			{ value: "EMAIL", label: "Email" },
			{ value: "VERBAL", label: "Verbal" },
		],
	},
	{
		name: "request_file",
		label: "Request File:",
		type: "file",
	},
	{
		name: "received_date",
		label: "Received Date:",
		type: "date",
	},
	{
		name: "description",
		label: "Description:",
		type: "text",
	},
	{
		name: "client_name",
		label: "Client Name:",
		type: "text",
	},
	{
		name: "division",
		label: "Division:",
		type: "text",
	},
	{
		name: "client_contact_name",
		label: "Client Contact Name:",
		type: "text",
	},
	{
		name: "client_email",
		label: "Client Contact Email:",
		type: "email",
	},
	{
		name: "invoicing_address",
		label: "Invoicing Address:",
		type: "text",
	},
	{
		name: "avantis_station",
		label: "Avantis Station:",
		type: "select",
		placeholder: "Choose an item...",
		options: [
			{ value: "UNITED_KINGDOM", label: "United Kingdom" },
			{ value: "SINGAPORE", label: "Singapore" },
			{ value: "UNITED_ARAB_EMIRATES", label: "United Arab Emirates" },
			{ value: "BRAZIL", label: "Brazil" },
			{ value: "BCS", label: "BCS" },
			{ value: "AES", label: "AES" },
			{ value: "LCAM", label: "LCAM" },
		],
	},
	{
		name: "avantis_services",
		label: "Avantis Services:",
		type: "select",
		placeholder: "Choose an item...",
		options: [
			{
				value: "DRILLING",
				label: "Drilling",
			},
			{ value: "MARINE_BOILERS", label: "Marine Boilers" },
			{ value: "marine-maintenance", label: "Marine Maintenance" },
			{
				value: "MARINE_SHIPYARD",
				label: "Marine Shipyard",
			},
			{ value: "SUPPORT", label: "Support" },
			{
				value: "PRODUCTION",
				label: "Production",
			},
			{ value: "SHUT_DOWN_SERVICES", label: "Shut Down Services" },
		],
	},
	{
		name: "requester",
		label: "Requester:",
		type: "text",
	},
	{
		name: "estimated_quote_date",
		label: "Estimated Quote Date:",
		type: "date",
	},
	{
		name: "expected_start_date",
		label: "Expected Start Date:",
		type: "date",
	},
	{
		name: "expected_duration",
		label: "Expected Duration:",
		type: "number",
	},
	{
		name: "vessel_site",
		label: "Vessel/Site:",
		type: "text",
	},
	{
		name: "general_operations_manager",
		label: "General/Operations Manager:",
		type: "text",
	},
	{
		name: "client_interface",
		label: "Client Interface/Key Account Manager:",
		type: "text",
	},
	{
		name: "probability_award",
		label: "Probability of Award:",
		type: "select",
		placeholder: "Choose an item...",
		options: [
			{ value: "A", label: "A" },
			{ value: "B", label: "B" },
			{ value: "C", label: "C" },
		],
	},
	{
		name: "comments",
		label: "Comments:",
		type: "text",
	},
];
