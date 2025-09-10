import { Button } from "@/components/ui/button";
import AddSpoolButton from "./add-spool-button";
import EditTableToggle from "./edit-table-toggle";
import SpoolLogDialog from "./spool-log/spool-log-dialog";
import { Download, Edit2 } from "lucide-react";

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
            <Button
                variant="outline"
                className="text-center"
                size={"sm"}
                data-cy="editHp"
                onClick={(e) => {
                    fetch(
                        `/api/fabrication-monitoring/${job}?excel-report=true`,
                    )
                        .then((res) => res.blob())
                        .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "jobs_report.xlsx";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        });
                }}
            >
                <Download />
                <span className="text-xs">Export Excel</span>
            </Button>

            {jobId && <SpoolLogDialog jobId={jobId} />}
            {canEdit && <EditTableToggle onToggle={onToggle} />}
            {canAddSpool && <AddSpoolButton job={job} />}
        </div>
    );
}
