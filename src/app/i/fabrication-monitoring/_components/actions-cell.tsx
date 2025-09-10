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
import { Skeleton } from "@/components/ui/skeleton";
import HOCAuthComponent from "@/lib/auth/hoc-auth-component";
import AccessControl from "@/lib/auth/policy-decision-point";
import { clientEnv } from "@/lib/constants/config";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Download, Edit2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteJob } from "../[job]/_actions/delete-job";
import { EditDialog } from "./edit-dialog";

export const ActionsCell: React.FC<{
    row: Row<FabricationMonitoringFetchReturn>;
    accessControl?: AccessControl;
}> = ({ row, accessControl }) => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    return (
        <>
            {!accessControl ? (
                <Skeleton
                    className="h-full w-full"
                    data-cy="actionHpMenu-skeleton"
                />
            ) : (
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
                                <HOCAuthComponent
                                    enforcePolicy={{
                                        roleBasedAccess: {
                                            action: "READ",
                                            resource: "fabrication-monitoring",
                                        },
                                    }}
                                >
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
                                </HOCAuthComponent>
                                <HOCAuthComponent
                                    enforcePolicy={{
                                        roleBasedAccess: {
                                            action: "EDIT",
                                            resource: "fabrication-monitoring",
                                        },
                                    }}
                                >
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
                                </HOCAuthComponent>
                                <HOCAuthComponent
                                    enforcePolicy={{
                                        roleBasedAccess: {
                                            action: "READ",
                                            resource: "fabrication-monitoring",
                                        },
                                    }}
                                >
                                    <DropdownMenuItem
                                        className="gap-x-5 text-center"
                                        data-cy="editHp"
                                        onClick={(e) => {
                                            const hp = row.getValue("hp");
                                            fetch(
                                                `/api/fabrication-monitoring/${hp}?excel-report=true`,
                                            )
                                                .then((res) => res.blob())
                                                .then((blob) => {
                                                    const url =
                                                        window.URL.createObjectURL(
                                                            blob,
                                                        );
                                                    const a =
                                                        document.createElement(
                                                            "a",
                                                        );
                                                    a.href = url;
                                                    a.download =
                                                        "jobs_report.xlsx";
                                                    document.body.appendChild(
                                                        a,
                                                    );
                                                    a.click();
                                                    a.remove();
                                                    window.URL.revokeObjectURL(
                                                        url,
                                                    );
                                                });
                                        }}
                                    >
                                        <Download />
                                        <span className="text-xs">
                                            Export Excel
                                        </span>
                                    </DropdownMenuItem>
                                </HOCAuthComponent>
                                <HOCAuthComponent
                                    enforcePolicy={{
                                        roleBasedAccess: {
                                            action: "DELETE",
                                            resource: "fabrication-monitoring",
                                        },
                                    }}
                                >
                                    <AlertDialogComponent
                                        onConfirm={async () => {
                                            try {
                                                await deleteJob(
                                                    row.getValue("hp"),
                                                );
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
                                                className="gap-x-5 text-center text-red-400"
                                                data-cy="deleteHp"
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <Trash2 className="" />
                                                <span className="">Delete</span>
                                            </DropdownMenuItem>
                                        }
                                    />
                                </HOCAuthComponent>
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
            )}
        </>
    );
};
