"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditButtonToggleProps {
    isEditing: boolean;
    toggle: () => void;
    onToggle?: (state: boolean) => void;
    disabled?: boolean;
}

export function useEditToggle(initialState = false) {
    const [isEditing, setIsEditing] = useState(initialState);

    const toggle = () => setIsEditing((prev) => !prev);
    const setEditing = (value: boolean) => setIsEditing(value);

    return { isEditing, toggle, setEditing };
}

export function EditButtonToggle({
    isEditing,
    toggle,
    onToggle,
    disabled,
}: EditButtonToggleProps) {
    const handleClick = () => {
        toggle();
        if (onToggle) onToggle(!isEditing);
    };

    return (
        <Button
            className={`mx-2 my-3 ${isEditing ? "bg-accent text-white" : ""}`}
            size="icon"
            variant="outline"
            onClick={handleClick}
            disabled={disabled}
            data-cy="editButtonToggle"
        >
            <Edit />
        </Button>
    );
}
