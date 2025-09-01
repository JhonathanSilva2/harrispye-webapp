import { AttributeKeys } from "@/app/api/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateAttributes } from "@/hooks/query/use-attributes";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";

interface Props {
    title: string;
    attributeKey: AttributeKeys;
}

export default function InputAddAttribute({ title, attributeKey }: Props) {
    const [value, setValue] = useState("");
    const { mutate, isPending } = useCreateAttributes();

    const handleAdd = () => {
        if (!value.trim()) return;

        mutate(
            { AttributeKey: attributeKey, AttributeValue: value },
            {
                onSuccess: () => {
                    setValue("");
                },
            },
        );
    };

    return (
        <div className="my-5">
            <div className="flex w-full max-w-sm items-center gap-2">
                <Input
                    type="text"
                    placeholder={`Add new ${title}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button
                    size="icon"
                    type="button"
                    className="w-10"
                    onClick={handleAdd}
                    disabled={isPending}
                >
                    <PlusCircle className={isPending ? "animate-spin" : ""} />
                </Button>
            </div>
        </div>
    );
}
