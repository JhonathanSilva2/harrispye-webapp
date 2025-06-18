import { Button } from "@/components/ui/button";
import { CirclePlus, Plus } from "lucide-react";
import { useState } from "react";
import { EditDialog } from "./edit-dialog";
import { useAccessControl } from "@/hooks/use-access-control";

export function AddHp() {
    const [isOpen, setIsOpen] = useState(false);
    const { accessControl, loading } = useAccessControl();
    const canWrite =
        accessControl?.hasRoleAccess("WRITE", "fabrication-monitoring") ??
        false;
    return (
        <EditDialog
            mode="create"
            triggerBtn={
                <Button
                    onClick={() => setIsOpen(true)}
                    size={"sm"}
                    variant={"constructive"}
                    disabled={!canWrite}
                    data-cy="addHp"
                >
                    <CirclePlus /> HP
                </Button>
            }
            open={isOpen}
            setOpen={setIsOpen}
        />
    );
}
