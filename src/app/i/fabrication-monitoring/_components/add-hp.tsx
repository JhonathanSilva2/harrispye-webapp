import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EditDialog } from "./edit-dialog";

export function AddHp() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<EditDialog
			mode="create"
			triggerBtn={
				<Button onClick={() => setIsOpen(true)} className="bg-primary">
					<Plus />
					Add HP
				</Button>
			}
			open={isOpen}
			setOpen={setIsOpen}
		/>
	);
}
