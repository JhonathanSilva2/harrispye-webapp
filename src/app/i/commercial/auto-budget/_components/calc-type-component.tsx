import { useAutobudget } from "../_providers/autobudget-context";
import { BudgetTypes } from "../types";
import { BudgetOptions } from "./budget-options";
import { BudgetComponentProps } from "./spec-component";

const CalcTypeComponent = <T extends BudgetTypes>({
    row,
    type,
    option,
}: BudgetComponentProps<T>) => {
    const { dispatch } = useAutobudget();

    return (
        <BudgetOptions
            title={"Calc Type"}
            options={[
                { label: "Unitary", value: "unit" },
                { label: "Daily", value: "daily" },
            ]}
            value={option || ""}
            onSelect={(value) => {
                dispatch({
                    type: `update-${type}`,
                    id: row.original.id,
                    data: { calcType: value as "unit" | "daily" | undefined },
                });
            }}
        />
    );
};

export default CalcTypeComponent;
