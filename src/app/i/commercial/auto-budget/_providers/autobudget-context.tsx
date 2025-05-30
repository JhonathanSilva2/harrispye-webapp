import { AutobudgetContants } from "@/lib/constants/autobudget";
import { createContext, useContext, useReducer } from "react";
import type {
	AutobudgetOuterStateType,
	AutobudgetReducerActions,
	AutobudgetStateType,
	BudgetActionTypes,
	BudgetOuterTypes,
} from "../types";
import { budgetActions } from "./actions";

const initialState: AutobudgetOuterStateType = {
	piping: [],
	looseMaterial: [],
	manual: [],
	service: [],
	totals: {
		margin: AutobudgetContants.DEFAULT_MARGIN_RATE,
		totalRevenue: 0,
		totalSales: 0,
	},
};

const updateMargin = (state: AutobudgetStateType) => {
	const budgetTypes = ["piping", "looseMaterial", "manual", "service"];
	budgetTypes.forEach((key) => {
		const Key = key as keyof AutobudgetStateType;
		const list = state[Key];
		list.forEach((row) => {
			state = {
				...state,
				...budgetActions.update(
					row.id,
					Key,
					state as AutobudgetOuterStateType,
					{},
				),
			};
		});
	});
	return {
		...state,
	};
};

const reducer = (
	state: typeof initialState,
	action: AutobudgetReducerActions,
) => {
	const [actionType, budgetType] = action.type.split("-") as [
		BudgetActionTypes,
		BudgetOuterTypes,
	];
	if (
		actionType !== "add" &&
		actionType !== "update" &&
		actionType !== "delete" &&
		budgetType !== "piping" &&
		budgetType !== "looseMaterial" &&
		budgetType !== "manual" &&
		budgetType !== "service" &&
		budgetType !== "totals"
	) {
		throw new Error(`Invalid action type: ${action.type}`);
	}
	if (budgetType === "totals") {
		if (actionType !== "update") {
			throw new Error(
				`Invalid action type ${action.type} on ${budgetType}`,
			);
		}
		const newState = {
			...state,
			totals: {
				...state.totals,
				margin: action.totals?.margin ?? state.totals.margin,
			},
		};

		const newerState = {
			...newState,
			...updateMargin(newState),
		};
		return newerState;
	}
	const newState = {
		...state,
		...budgetActions[actionType](
			action.id,
			budgetType,
			state,
			action.data ?? {},
		),
	};
	return newState;
};

export const AutobudgetContext = createContext<{
	state: typeof initialState;
	dispatch: (action: AutobudgetReducerActions) => void;
}>({
	state: initialState,
	dispatch: (action: AutobudgetReducerActions) => {},
});

export const AutobudgetTotalsContext = createContext({});

export const AutobudgetProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<AutobudgetContext.Provider
			value={{
				state,
				dispatch,
			}}
		>
			{children}
		</AutobudgetContext.Provider>
	);
};

export const useAutobudget = () => {
	return useContext(AutobudgetContext);
};
