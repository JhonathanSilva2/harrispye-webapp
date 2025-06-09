import { AutobudgetOuterStateType } from "@/app/i/commercial/auto-budget/types";
import { AvantisServices, AvantistStation } from "@prisma/client-proposals";

export type CostingData = {
    erfData: EnquiryRequestFormData;
    deliveryDates: delivery_list;
    budgetData: AutobudgetOuterStateType;
};
type budget_data = {
    piping: BudgetItemWithBreakdown[];
    looseMaterial: BudgetItemWithBreakdown[];
    manual: BudgetItemWithBreakdown[];
    service: ServiceItem[];
};

type delivery_list = {
    sea_freight: number;
    air_freight: number;
    importation_clearance: number;
    material_verification: number;
    abs_involvement: number;
    fabrication: number;
    pressure_test: number;
    ndt: number;
    heat_treatment: number;
    painting: number;
    passivation: number;
    packing_nf_request: number;
    extimated_date: number;
};

type EnquiryRequestFormData = {
    created_by: string;
    acronym_number: string | null;
    enquiry_source: "EMAIL" | "VERBAL";
    received_date: Date | undefined;
    vessel_site: string | undefined;
    description: string | undefined;
    client_name: string | undefined;
    division: string | undefined;
    client_contact_name: string | undefined;
    client_email: string | undefined;
    invoicing_address: string | undefined;
    avantis_station?: AvantistStation | undefined; // Permite undefined
    client_interface: string | undefined;
    avantis_services: AvantisServices | undefined;
    requester: string;
    estimated_quote_date: string | undefined;
    estimated_quote_value: number | null;
    expected_start_date: string | undefined;
    expected_duration: number;
    probability_award: "A" | "B" | "C";
    comments: string;
    general_operations_manager: string;
};
type Taxes = {
    type?: string;
    ncm?: string;
    "pis/cofins": number;
    icms?: number;
    ipi?: number;
    iss?: number;
};

type Breakdown = {
    TYPE: string;
    CLASS: number;
    LABOUR: number;
    MATERIALS: number;
    CONSUMBALES: number;
    gasket_name: string;
    u_bolt_name: string;
    "ROAD FREIGHT": number;
    "INDIRECT COST": number;
    stud_bolt_name: string;
    "FOOD ALLOWANCES": number;
    "OTHER DIRECT COST": number;
    "EXTERNAL PLANT HIRE": number;
    "INSPEC TESTING TREAT": number;
};

type BudgetItemWithBreakdown = {
    cost: number;
    "raw cost": number;
    ncm: string;
    taxes: Taxes;
    "price per kg": number;
    breakdown: Breakdown;
    type: string;
    spec?: string;
    diameter?: number;
    weight?: number;
    "complexity factor"?: number;
    "num joints"?: number;
    "part description"?: string;
    quantity?: number | null;
};

type ServiceItem = {
    cost: number;
    "raw cost": number;
    taxes: Taxes;
    details: string;
    price: number;
    quantity: number;
    "service quantity": number;
    "service type": string;
    type: string;
    un: string;
};
