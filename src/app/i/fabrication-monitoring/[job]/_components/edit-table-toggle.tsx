"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditTableToggleProps {
    onToggle?: (isEditing: boolean) => void;
    disabled?: boolean;
}

export default function EditTableToggle({
    onToggle,
    disabled,
}: EditTableToggleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const handleToggle = () => {
        setIsEditing((prev) => !prev);
        if (onToggle) onToggle(!isEditing); // Passa o novo estado para o pai
    };

    return (
        <Button
            className={`${isEditing ? "bg-accent text-white" : ""}`}
            size="icon"
            variant="outline"
            onClick={handleToggle}
            disabled={!disabled} // Desabilita o botão se não estiver editando
            data-cy="editTableToggle"
        >
            <Edit />
        </Button>
    );
}
