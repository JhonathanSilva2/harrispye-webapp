import React from "react";
import AddSpoolButton from "./add-spool-button";
import EditTableToggle from "./edit-table-toggle";
import AccessControl from "@/lib/auth/policy-decision-point";

interface TableHeaderProps {
    job: string;
    onToggle?: (isEditing: boolean) => void;
    canEdit: boolean;
    canWrite: boolean;
}
export default function TableHeader({
    job,
    onToggle,
    canEdit,
    canWrite,
}: TableHeaderProps) {
    // verificar se o usuário tem permissão EDIT OR ALL
    // Placeholder for actual permission check
    return (
        <div className="gapx-2 flex">
            <AddSpoolButton canWrite={canWrite} job={job} />
            <EditTableToggle disabled={canEdit} onToggle={onToggle} />
        </div>
    );
}
