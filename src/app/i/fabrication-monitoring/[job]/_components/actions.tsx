import { Row, Table } from "@tanstack/react-table";
import { fabrication_monitoring } from "prisma/generated/client-hp-base";
import DeleteSpoolButton from "./delete-spool-button";
interface ActionsProps {
    row: Row<fabrication_monitoring>;
    table: Table<fabrication_monitoring>;
    deleteSpool: boolean;
}
export default function Actions({ row, table, deleteSpool }: ActionsProps) {
    const hp = table.options.meta!.hp ?? "";
    const spoolID = String(row.original.id);
    return (
        <DeleteSpoolButton
            disabled={!deleteSpool}
            job={hp}
            spoolID={String(spoolID)}
        />
    );
}
