"use client";

import { cloneDeep } from "lodash";
import type { fabrication_monitoring } from "prisma/generated/client-hp-base";
import type { Decimal } from "prisma/generated/client-hp-base/runtime/library";
import { createContext, useContext, useReducer } from "react";

export type FabMonSpoolsReducerActions =
    | { type: "reset"; job: string }
    | { type: "init"; job: string; payload: fabrication_monitoring[] }
    | {
          type: "update";
          job: string;
          id: string | number;
          payload: fabrication_monitoring;
      };

const initialState: {
    [key: string | number]: fabrication_monitoring;
} = {};

const reducer = (
    state: typeof initialState,
    action: FabMonSpoolsReducerActions,
) => {
    switch (action.type) {
        case "reset":
            return initialState;
        case "init":
            const initState: typeof initialState = {};
            action.payload.forEach((item) => {
                initState[item.id] = item;
            });
            return initState;
        case "update":
            const newState = cloneDeep(state);
            const { id, payload } = action;
            newState[id] = payload;

            payload.gross_spool_cost = (Number(payload.mass) *
                Number(payload.price_per_kg)) as unknown as Decimal;

            return newState;
        default:
            throw new Error("Invalid Action Type");
    }
};

type Ctx = {
    state: typeof initialState;
    dispatch: React.Dispatch<FabMonSpoolsReducerActions>;
};
const FabMonSpoolsContext = createContext<Ctx | null>(null);

export const FabMonSpoolsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <FabMonSpoolsContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </FabMonSpoolsContext.Provider>
    );
};

export const useFabMonSpools = () => {
    const ctx = useContext(FabMonSpoolsContext);
    if (!ctx)
        throw new Error(
            "useFabMonSpools must be used within FabMonSpoolsProvider",
        );
    return ctx;
};
