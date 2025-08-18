"use client";
import { Button } from "@/components/ui/button";
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
            className={`${isEditing ? "bg-accent text-white" : ""}`}
            size="icon"
            variant="outline"
            onClick={handleToggle}
            data-cy="editTableToggle"
        >
            {isEditing ? <Edit /> : <CheckSquare />}
        </Button>
    );
}
