"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { fabrication_monitoring } from "prisma/generated/client-hp-base";
import { useEffect, useState } from "react";
import { useFabMonSpools } from "../fabrication-monitoring/[job]/_providers/fab-mon-spool-provider";
import patchOnDiff from "../fabrication-monitoring/[job]/_utils/patch-on-diff";

const TestComponent = () => {
    const { state, dispatch } = useFabMonSpools();
    const [input, setInput] = useState("");
    const handleInput = (newInput: string) => {
        setInput(newInput);
    };

    const id = 1;
    useEffect(() => {
        const payload = [
            {
                id, // simple unique id for demo
                fabrication_monitoring_design_id: null,
                id_fabrication_monitoring_jobs: 1,
                spec: "Default spec",
                mass: 0,
                price_per_kg: 0,
                m2_fbe: 0,
                m2_galvanized: 0,
                m2_price: 0,
                gross_spool_cost: 0,
                description: "",
                drawing_ref: "",
                spool_number: `SN-${Date.now()}`,
                materials_ordered: 0,
                materials_arrived: 0,
                fabrication_complete: 0,
                scan_3d: 0,
                ndt_complete: 0,
                pressure_test: 0,
                internal_coating: 0,
                external_coating: 0,
                packing: 0,
                dispatch: 0,
                notes: "",
                client_approval: "PENDING",
                manager_approval: "PENDING",
                updated_by: null,
                updated_at: null,
                drawing_sort_key: null,
                spool_sort_key: null,
            },
        ] as unknown as fabrication_monitoring[];

        dispatch({
            type: "init",
            job: "TEST",
            payload,
        });
    }, [dispatch]);

    const setNewRow = () => {
        const payload = {
            id, // simple unique id for demo
            fabrication_monitoring_design_id: null,
            id_fabrication_monitoring_jobs: 1,
            spec: "Default spec",
            mass: Number(input),
            price_per_kg: 1,
            m2_fbe: 0,
            m2_galvanized: 0,
            m2_price: 0,
            gross_spool_cost: 0,
            description: "",
            drawing_ref: "",
            spool_number: `SN-${input}`,
            materials_ordered: 0,
            materials_arrived: 0,
            fabrication_complete: 0,
            scan_3d: 0,
            ndt_complete: 0,
            pressure_test: 0,
            internal_coating: 0,
            external_coating: 0,
            packing: 0,
            dispatch: 0,
            notes: "",
            client_approval: "PENDING",
            manager_approval: "PENDING",
            updated_by: null,
            updated_at: null,
            drawing_sort_key: null,
            spool_sort_key: null,
        } as unknown as fabrication_monitoring;

        patchOnDiff(id, "TEST", state[id], payload, dispatch);
    };

    const resetReducer = () => {
        dispatch({
            type: "reset",
            job: "TEST",
        });
    };

    return (
        <>
            <div className="flex gap-2">
                <Input onChange={(e) => handleInput(e.target.value)} />
                <Button type="button" onClick={setNewRow}>
                    Add To Reducer
                </Button>
                <Button
                    type="button"
                    variant={"destructive"}
                    onClick={resetReducer}
                >
                    Reset
                </Button>
            </div>
            <pre>{JSON.stringify(state, null, 4)}</pre>
        </>
    );
};

export default TestComponent;
