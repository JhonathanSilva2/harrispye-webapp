import { EnquiryRequestFormData } from "@/schemas/erf";
import {
    AvantisServices,
    AvantistStation,
    Enquiry,
    Prisma,
    ProbabilityAward,
} from "@/../prisma/generated/client-proposals";
export function toErfCreateInput(
    data: EnquiryRequestFormData,
): Prisma.erfCreateInput {
    // required-date coercion helper
    const asDate = (val: string | Date | undefined, field: string): Date => {
        if (!val) throw new Error(`Missing required date: ${field}`);
        const d = typeof val === "string" ? new Date(val) : val;
        if (isNaN(d.getTime()))
            throw new Error(`Invalid date for ${field}: ${val}`);
        return d;
    };

    return {
        // convert all to Date
        received_date: asDate(data.received_date, "received_date"),
        estimated_quote_date: asDate(
            data.estimated_quote_date,
            "estimated_quote_date",
        ),
        expected_start_date: asDate(
            data.expected_start_date,
            "expected_start_date",
        ),
        // enums
        enquiry_source: data.enquiry_source as Enquiry,
        avantis_station: data.avantis_station as AvantistStation,
        avantis_services: data.avantis_services as AvantisServices,
        probability_award: data.probability_award as ProbabilityAward,

        // strings & numbers
        vessel_site: data.vessel_site ?? "",
        description: data.description ?? "",
        client_name: data.client_name ?? "",
        division: data.division ?? "",
        client_contact_name: data.client_contact_name ?? "",
        client_email: data.client_email ?? "",
        invoicing_address: data.invoicing_address ?? "",
        client_interface: data.client_interface ?? "",
        requester: data.requester,
        estimated_quote_value: data.estimated_quote_value ?? undefined,
        expected_duration: Number(data.expected_duration),
        comments: data.comments ?? "",
        general_operations_manager: data.general_operations_manager,
    };
}
