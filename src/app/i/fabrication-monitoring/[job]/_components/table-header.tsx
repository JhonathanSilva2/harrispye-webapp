import AddSpoolButton from "./add-spool-button";
import EditTableToggle from "./edit-table-toggle";
import SpoolLogDialog from "./spool-log/spool-log-dialog";

interface TableHeaderProps {
    job: string;
    jobId?: number;
    onToggle?: (isEditing: boolean) => void;
    canEdit: boolean;
    canAddSpool: boolean;
}
export default function TableHeader({
    job,
    jobId,
    onToggle,
    canEdit,
    canAddSpool,
}: TableHeaderProps) {
    // verificar se o usuário tem permissão EDIT OR ALL
    // Placeholder for actual permission check
    return (
        <div className="flex gap-2">
            {jobId && <SpoolLogDialog jobId={jobId} />}
            <EditTableToggle disabled={canEdit} onToggle={onToggle} />
            <AddSpoolButton canAddSpool={canAddSpool} job={job} />
        </div>
    );
}
