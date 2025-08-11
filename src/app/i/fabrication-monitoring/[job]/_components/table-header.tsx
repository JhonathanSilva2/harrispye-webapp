import React from "react";
import AddSpoolButton from "./add-spool-button";
import EditTableToggle from "./edit-table-toggle";
import SpoolLogDialog from "./spool-log/spool-log-dialog";

interface TableHeaderProps {
    job: string;
    jobId?: number;
    onToggle?: (isEditing: boolean) => void;
    canEdit: boolean;
    canWrite: boolean;
}
export default function TableHeader({
    job,
    jobId,
    onToggle,
    canEdit,
    canWrite,
}: TableHeaderProps) {
    // verificar se o usuário tem permissão EDIT OR ALL
    // Placeholder for actual permission check
    return (
        <div className="flex gap-2">
            {jobId && <SpoolLogDialog jobId={jobId} />}
            <EditTableToggle disabled={canEdit} onToggle={onToggle} />
            <AddSpoolButton canWrite={canWrite} job={job} />
        </div>
    );
}
