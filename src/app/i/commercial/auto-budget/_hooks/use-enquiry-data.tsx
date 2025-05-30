import { EnquiryRequestFormData } from "@/schemas/erf";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useEnquiryData() {
	const [formData, setFormData] = useState<EnquiryRequestFormData | null>(
		null,
	);

	useEffect(() => {
		const json = localStorage.getItem("enquiryRequest");
		if (json) {
			try {
				const data: EnquiryRequestFormData = JSON.parse(json);
				setFormData(data);
			} catch (error) {
				toast.warning("Warning", {
					description:
						"Enquiry Request data was not filled or failed to be fetched. Be warned that the proposal won't be generated.",
				});
				console.log("Error when trying to parse enquiryRequest");
			}
		}
	}, []);

	return { formData };
}
