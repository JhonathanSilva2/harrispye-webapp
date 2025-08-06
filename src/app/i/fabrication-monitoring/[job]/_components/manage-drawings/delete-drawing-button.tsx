import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteDrawing } from "@/hooks/query/use-drawings";
import { Trash2 } from "lucide-react";
import React from "react";

interface DeleteDrawingButtonProps {
    url: string;
    drawingId: number;
}

const DeleteDrawingButton = ({ url, drawingId }: DeleteDrawingButtonProps) => {
    const mutation = useDeleteDrawing();
    const handleDelete = () => {
        mutation.mutate(drawingId);
    };

    return (
        <DropdownMenuItem
            className="cursor-pointer text-center text-red-500 hover:text-red-500/90"
            onSelect={handleDelete}
        >
            <Trash2 />
            <span className="grow">Delete</span>
        </DropdownMenuItem>
    );
};

export default DeleteDrawingButton;
