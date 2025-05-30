'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditTableToggleProps {
    onToggle?: (isEditing: boolean) => void;
}

export default function EditTableToggle({ onToggle }: EditTableToggleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const handleToggle = () => {
            setIsEditing((prev) => !prev);
            if (onToggle) onToggle(!isEditing); // Passa o novo estado para o pai
        };

    return (
        <Button 
            className={`my-3 mx-2 ${isEditing ? 'bg-accent text-white' : ''}`} 
            size="icon" 
            variant="outline" 
            onClick={handleToggle}
        >
            <Edit />
        </Button>
    );
}
