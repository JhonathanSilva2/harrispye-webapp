"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckSquare, Edit } from "lucide-react";
import { useState } from "react";

interface EditTableToggleProps {
    onToggle?: (isEditing: boolean) => void;
    disabled?: boolean;
}

export default function EditTableToggle({ onToggle }: EditTableToggleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const handleToggle = () => {
        setIsEditing((prev) => !prev);
        if (onToggle) onToggle(!isEditing); // Passa o novo estado para o pai
    };

    return (
        <Button
            className={cn("min-w-24", {
                "bg-accent text-white": !isEditing,
            })}
            variant="outline"
            onClick={handleToggle}
            data-cy="editTableToggle"
        >
            {!isEditing ? <Edit /> : <CheckSquare />}
            {!isEditing ? " Edit" : "Editing"}
        </Button>
    );
}
