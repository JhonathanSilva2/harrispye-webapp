import { UserFullProfile } from "@/app/types";
import UserForm from "@/components/forms/user-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
    KeyRound,
    LockKeyhole,
    MoreHorizontal,
    ScrollText,
    UserRoundPen,
} from "lucide-react";
import { useState } from "react";
import UserAccessControl from "./user-access-control";
import EditUserPolicy from "./user-policy";

export const usersColumns: ColumnDef<UserFullProfile>[] = [
    {
        accessorKey: "hp_registration",
        header: "#",
        cell: ({ row }) => <Badge>{row.getValue("hp_registration")}</Badge>,
    },
    {
        accessorKey: "display_name",
        header: "Display Name",
        cell: ({ row }) => row.getValue("display_name"),
    },
    {
        accessorKey: "username",
        header: "Email",
        cell: ({ row }) => row.getValue("username"),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => row.getValue("role"),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => row.original.department?.department,
    },
    {
        accessorKey: "manager",
        header: "Manager",
        cell: ({ row }) => row.original.manager?.display_name,
    },
    {
        accessorKey: "_actions",
        header: "Actions",
        /* eslint-disable react-hooks/rules-of-hooks */
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false);

            return (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button className="h-6" variant="ghost">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel className="">
                            Options
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Dialog
                                onOpenChange={(dialogOpen) => {
                                    if (!dialogOpen) {
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <UserRoundPen />
                                        <span>Edit User</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit User</DialogTitle>
                                        <DialogDescription>
                                            Make changes to{" "}
                                            {row.original.display_name} here.
                                            Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <UserForm
                                        user={{
                                            id: row.original.id,
                                            hp_registration:
                                                row.original.hp_registration ||
                                                0,
                                            name: row.original.name,
                                            display_name:
                                                row.original.display_name,
                                            username: row.original.username,
                                            role: row.original.role || "",
                                            department: Number(
                                                row.original.department || "",
                                            ),
                                            direct_manager:
                                                row.original.manager
                                                    ?.hp_registration || 0,
                                            admission_date:
                                                row.original.admission_date ||
                                                new Date(),
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                onOpenChange={(dialogOpen) => {
                                    if (!dialogOpen) {
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <ScrollText />
                                        <span>Attributes</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Attributes</DialogTitle>
                                        <DialogDescription>
                                            Make changes to User&apos;s
                                            Attributes here. In case you have
                                            the neccessary permissions: Click
                                            save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <EditUserPolicy
                                        userAttributes={
                                            row.original.userAttributes
                                        }
                                    />
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                onOpenChange={(dialogOpen) => {
                                    if (!dialogOpen) {
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <KeyRound />
                                        <span>Access Control</span>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Access Control
                                        </DialogTitle>
                                    </DialogHeader>
                                    <UserAccessControl row={row} />
                                </DialogContent>
                            </Dialog>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-400">
                                <LockKeyhole />
                                <span>Disable User</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableSorting: false,
    },
];
/* eslint-enable react-hooks/rules-of-hooks */
