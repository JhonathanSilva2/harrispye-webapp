// enquiry-request.schema.ts
import { z } from "zod";

export const EnquiryRequestFormSchema = z
	.object({
		received_date: z.coerce.date({
			required_error: "Received date is required",
			invalid_type_error: "Invalid date format",
		}),
		enquiry_source: z.enum(["EMAIL", "VERBAL"], {
			required_error: "Select the enquiry source",
		}),
		request_file: z.any().optional(),
		description: z.string().nonempty("Description is required"),
		client_name: z.string().nonempty("Client name is required"),
		division: z.string().nonempty("Division is required"),
		client_contact_name: z
			.string()
			.nonempty("Client contact name is required"),
		client_email: z.string().email("Invalid email address"),
		invoicing_address: z.string().nonempty("Invoicing address is required"),
		avantis_station: z.enum(
			[
				"UNITED-KINGDOM",
				"SINGAPORE",
				"UNITED_ARAB_EMIRATES",
				"BRAZIL",
				"BCS",
				"AES",
				"LCAM",
			],
			{ required_error: "Avantis station is required" },
		),
		avantis_services: z.enum(
			[
				"DRILLING",
				"MARINE_BOILERS",
				"MARINE_MAINTENANCE",
				"MARINE_SHIPYARD",
				"SUPPORT",
				"PRODUCTION",
				"SHUT_DOWN_MAINTENANCE",
			],
			{ required_error: "Avantis service is required" },
		),
		requester: z.string().nonempty("Requester is required"),
		estimated_quote_date: z.coerce.date({
			required_error: "Estimated quote date is required",
			invalid_type_error: "Invalid date format",
		}),
		probability_award: z
			.enum(["A", "B", "C"], {
				required_error: "Probability rating is required",
			})
			.transform((val) => val.toUpperCase()),

		expected_start_date: z.coerce.date({
			required_error: "Expected start date is required",
			invalid_type_error: "Invalid date format",
		}),
		estimated_quote_value: z.preprocess((val) => {
			if (val === "" || val === null || val === undefined)
				return undefined;
			if (
				typeof val === "object" &&
				val !== null &&
				"floatValue" in val
			) {
				return val.floatValue;
			}
			if (typeof val === "string") {
				const num = val
					.replace(/\./g, "")
					.replace(",", ".")
					.replace(/[^\d.]/g, "");
				return parseFloat(num);
			}
			return val;
		}, z.number().optional()),
		expected_duration: z.coerce
			.number()
			.nonnegative("Expected duration must be non-negative"),
		comments: z.string().optional(),
		general_operations_manager: z
			.string()
			.nonempty("General operations manager is required"),
		vessel_site: z.string().nonempty("Vessel/Site is required"),
		client_interface: z.string().nonempty("Client interface is required"),
	})
	.strict();

export type EnquiryRequestFormData = z.infer<typeof EnquiryRequestFormSchema>;
