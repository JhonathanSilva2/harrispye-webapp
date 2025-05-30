import { delivery_list } from "@/app/api/commercial/generate-job-number/type";
import { FieldValues } from "react-hook-form";
export interface GenericInputProps<T extends FieldValues> {
	name: keyof delivery_list; // Aqui estamos dizendo que `name` deve ser uma chave de `delivery_list`
	label: string;
	type: string;
}
export const deliveryDatesInputData: GenericInputProps<FieldValues>[] = [
	{
		name: "sea_freight",
		label: "Sea Freight",
		type: "number",
	},
	{
		name: "air_freight",
		label: "Air Freight",
		type: "number",
	},
	{
		name: "importation_clearance",
		label: "Importation Clearance",
		type: "number",
	},
	{
		name: "material_verification",
		label: "Material Procurament",
		type: "number",
	},
	{
		name: "abs_involvement",
		label: "ABS Involvement",
		type: "number",
	},
	{
		name: "fabrication",
		label: "Fabrication",
		type: "number",
	},
	{
		name: "pressure_test",
		label: "Pressure Test",
		type: "number",
	},
	{
		name: "ndt",
		label: "NDT",
		type: "number",
	},
	{
		name: "heat_treatment",
		label: "Heat Treatment",
		type: "number",
	},
	{
		name: "painting",
		label: "Painting",
		type: "number",
	},
	{
		name: "passivation",
		label: "Passivation",
		type: "number",
	},
	{
		name: "packing_nf_request",
		label: "Packing and NF Request",
		type: "number",
	},
];
