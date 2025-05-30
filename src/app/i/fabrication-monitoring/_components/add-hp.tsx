import { Button } from "@/components/ui/button";
import { CirclePlus, Plus } from "lucide-react";
import { useState } from "react";
import { EditDialog } from "./edit-dialog";

export function AddHp() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <EditDialog
            mode="create"
            triggerBtn={
                <Button
                    onClick={() => setIsOpen(true)}
                    size={"sm"}
                    variant={"constructive"}
                >
                    <CirclePlus /> HP
                </Button>
            }
            open={isOpen}
            setOpen={setIsOpen}
        />
    );
}
