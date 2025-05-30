import UserForm from "@/components/forms/user-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function AddUserDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-400">
                    <Plus size={10} /> User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Create the new user here. Click submit when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <UserForm />
            </DialogContent>
        </Dialog>
    );
}
