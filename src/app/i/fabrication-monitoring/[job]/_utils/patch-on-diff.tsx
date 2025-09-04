import shallowDiffObjects from "@/utils/shallow-diff-objects";
import { isEqual } from "lodash";
import { fabrication_monitoring } from "prisma/generated/client-hp-base";
import { Dispatch } from "react";
import { toast } from "sonner";
import { patchSpool } from "../../_actions/patch-spool";
import { FabMonSpoolsReducerActions } from "../_providers/fab-mon-spool-provider";

export default async function patchOnDiff(
    id: string | number,
    job: string,
    prev: fabrication_monitoring,
    next: fabrication_monitoring,
    dispatch: Dispatch<FabMonSpoolsReducerActions>,
) {
    if (!isEqual(prev, next)) {
        const diff = shallowDiffObjects(prev, next);
        try {
            await patchSpool(
                job,
                id.toString(),
                diff as fabrication_monitoring,
            );
            dispatch({
                type: "update",
                job: "TEST",
                id,
                payload: next,
            });
            toast.success("Updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Update failed");
        }
    }
    toast.info("No changes made");
}
