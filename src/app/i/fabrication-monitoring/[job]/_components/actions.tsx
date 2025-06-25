import React from "react";
import DeleteSpoolButton from "./delete-spool-button";
import { fabrication_monitoring } from "prisma/generated/client-hp-base";
import { Row, Table } from "@tanstack/react-table";
import { PermissionValue } from "../_permissions/types";
interface ActionsProps<TData> {
    row: Row<fabrication_monitoring>;
    table: Table<TData>;
    permission: PermissionValue;
}
export default function Actions<TData>({
    row,
    table,
    permission,
}: ActionsProps<TData>) {
    const hp = table.options.meta!.hp ?? "";
    const spoolID = String(row.original.id);
    const cantDelete = permission !== "DELETE" && permission !== "ALL";
    return (
        <DeleteSpoolButton
            disabled={cantDelete}
            job={hp}
            spoolID={String(spoolID)}
        />
    );
}
