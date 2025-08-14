import { Combobox, ComboboxOption } from "@/components/combobox";
import React from "react";
interface AttributesSearchBoxProps {
    isEditing: boolean;
    value: string | null;
    onSearch: (query: string) => void;
    data: ComboboxOption[];
    placeholder?: string;
}
export default function AttributesSearchBox({
    isEditing,
    onSearch,
    data,
    value,
    placeholder,
}: AttributesSearchBoxProps) {
    if (isEditing) {
        return (
            <Combobox
                placeholder={placeholder}
                options={data}
                value={value}
                onChange={onSearch}
            />
        );
    }
    return <h3>{placeholder}</h3>;
}
