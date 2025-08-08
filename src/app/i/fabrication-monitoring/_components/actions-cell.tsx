import { FabricationMonitoringFetchReturn } from "@/app/api/fabrication-monitoring/route";
import { AlertDialogComponent } from "@/components/alert";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientEnv } from "@/lib/constants/config";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteJob } from "../[job]/_actions/delete-job";
import { EditDialog } from "./edit-dialog";
import { useAccessControl } from "@/hooks/use-access-control";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const ActionsCell: React.FC<{
    row: Row<FabricationMonitoringFetchReturn>;
}> = ({ row }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { accessControl, loading } = useAccessControl();
    const actionsPermissions = accessControl?.checkAccessControlActions(
        "fabrication-monitoring",
    );
    const canRead = accessControl?.isSomeAccess("fabrication-monitoring");
    if (loading) {
        return (
            <Skeleton
                className="h-full w-full"
                data-cy="actionHpMenu-skeleton"
            />
        );
    }
    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="h-6"
                        variant="ghost"
                        data-cy="actionHpMenu"
                    >
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-36">
                    <DropdownMenuLabel className="text-center">
                        {row.getValue("hp")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {/* SUMMARY */}
                        {(canRead ?? false) && (
                            <DropdownMenuItem
                                className="gap-x-5 text-center"
                                data-cy="accessFabricationProject"
                                onClick={() =>
                                    router.push(
                                        `${clientEnv.NEXT_PUBLIC_URL}/i/fabrication-monitoring/${row.getValue(
                                            "hp",
                                        )}`,
                                    )
                                }
                            >
                                <Send />
                                <span>Summary</span>
                            </DropdownMenuItem>
                        )}
                        {/* EDIT */}
                        {((actionsPermissions?.EDIT ||
                            actionsPermissions?.ALL) ??
                            false) && (
                            <DropdownMenuItem
                                className="gap-x-5 text-center"
                                data-cy="editHp"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setIsEditDialogOpen(true);
                                }}
                            >
                                <Edit2 />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        )}

                        {/* DELETE */}
                        {(actionsPermissions?.DELETE ?? false) && (
                            <AlertDialogComponent
                                onConfirm={async () => {
                                    try {
                                        await deleteJob(row.getValue("hp"));
                                        queryClient.invalidateQueries({
                                            queryKey: ["fab-mon-jobs"],
                                        });
                                        setIsOpen(false);
                                    } catch (error) {
                                        toast.error(
                                            "Failed to delete job. Please try again.",
                                        );
                                        console.error(
                                            "Failed to delete job:",
                                            error,
                                        );
                                        setIsOpen(false);
                                    }
                                }}
                                triggerBtn={
                                    <DropdownMenuItem
                                        className="gap-x-5 text-center"
                                        data-cy="deleteHp"
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <Trash2 className="text-red-500" />
                                        <span className="text-red-500">
                                            Delete
                                        </span>
                                    </DropdownMenuItem>
                                }
                            />
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {isEditDialogOpen && (
                <EditDialog
                    mode="edit"
                    hp={row.getValue("hp")}
                    open={isEditDialogOpen}
                    setOpen={setIsEditDialogOpen}
                />
            )}
        </>
    );
};
