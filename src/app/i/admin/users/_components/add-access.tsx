import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddAccessForm from "../_forms/add-access-form";

export function AddAccessDropdown({ id }: { id: number }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button size={"icon"}>
                    <PlusCircle />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Add Access</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <AddAccessForm
                        id={id}
                        className="flex flex-col gap-2 p-2"
                        submitFn={() => {
                            setIsOpen(false);
                        }}
                    />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
