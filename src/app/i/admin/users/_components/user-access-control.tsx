import { TAccessControl, UserFullProfile } from "@/app/types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { Loader2, Trash2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
    useDeleteUserAccessControl,
    useUserAccessControl,
} from "../_hooks/use-user-access-control";
import { AddAccessDropdown } from "./add-access";

interface Props {
    row: Row<UserFullProfile>;
}
// use react-query to fetch/update/delete userAccessControl
const UserAccessControl = ({ row }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedAccessControl, setSelectedAccessControl] = useState<
        TAccessControl[] | null
    >(null);

    const {
        data: userAccessControl,
        isPending: isPendingFetch,
        isError: isErrorFetch,
    } = useUserAccessControl({
        id: row.original.id,
    });

    const { mutate, isPending: isPendingDelete } = useDeleteUserAccessControl();

    const handleSearch = (value: string) => {
        setSearch(value);
        setSelectedAccessControl(
            userAccessControl?.filter(
                (accessControl) =>
                    accessControl.feature
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    accessControl.action
                        .toLowerCase()
                        .includes(value.toLowerCase()),
            ) ?? null,
        );
    };

    useEffect(() => {
        if (userAccessControl) {
            setSelectedAccessControl(userAccessControl);
            handleSearch(search);
        }
    }, [userAccessControl, search, handleSearch]);

    async function toggleDeletion() {
        setIsDeleting(!isDeleting);
    }
    return (
        <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-end gap-2">
                    <Input
                        value={search}
                        type="search"
                        autoComplete="off"
                        placeholder="Search..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {!isDeleting && <AddAccessDropdown id={row.original.id} />}
                    <Button
                        size={"icon"}
                        variant={!isDeleting ? "destructive" : "secondary"}
                        onClick={toggleDeletion}
                    >
                        {!isDeleting ? <Trash2 /> : <Undo2 />}
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                {!isPendingFetch ? (
                    selectedAccessControl?.map((accessControl) => {
                        const key = `${accessControl.feature}.${accessControl.action}`;
                        return isDeleting ? (
                            <BadgeDelete
                                key={key}
                                name={key}
                                isPending={isPendingDelete}
                                onClick={() => {
                                    mutate({
                                        id: row.original.id,
                                        feature: accessControl.feature,
                                        action: accessControl.action,
                                    });
                                }}
                            />
                        ) : (
                            <Badge
                                key={key}
                                variant="secondary"
                                className="flex w-[150px] items-center justify-center text-nowrap text-center"
                            >
                                {key}
                            </Badge>
                        );
                    })
                ) : !isErrorFetch ? (
                    <p className="flex gap-2 opacity-50">
                        <Loader2 className="animate-spin" />
                        Loading...
                    </p>
                ) : (
                    "No access control found"
                )}
            </div>
        </div>
    );
};

export default UserAccessControl;

const BadgeDelete = ({
    name,
    isPending,
    onClick,
}: {
    name: string;
    isPending?: boolean;
    onClick: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const [badgeContent, setBadgeContent] = useState<string | null>(name);
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Badge
                    className="flex w-[150px] cursor-pointer items-center justify-center text-nowrap bg-destructive text-center text-white hover:animate-pulse hover:bg-destructive/90"
                    onMouseOver={() => setBadgeContent("Delete")}
                    onMouseLeave={() => setBadgeContent(name)}
                >
                    {badgeContent}
                </Badge>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {isPending ? (
                        <Button variant={"ghost"} className="text-white">
                            <Loader2 className="animate-spin" />
                        </Button>
                    ) : (
                        <>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    onClick();
                                    setOpen(false);
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
