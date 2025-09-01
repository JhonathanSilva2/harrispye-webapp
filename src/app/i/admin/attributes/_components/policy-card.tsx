import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { DictionaryList } from "../types";
import { TableCardPolicy } from "./table-card-policy";
import { Input } from "@/components/ui/input";
import InputAddAttribute from "./input-add-attribute";
import { AttributeKeys } from "@/app/api/type";

interface Props {
    title: string;
    isLoading: boolean;
    content?: DictionaryList[];
    attributeKey: AttributeKeys;
}

export function PolicyCard({ title, isLoading, content, attributeKey }: Props) {
    return (
        <Card className="flex-grow flex-wrap">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between gap-4">
                        <p>{title}</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <InputAddAttribute title={title} attributeKey={attributeKey} />
                {!isLoading ? (
                    <TableCardPolicy dictList={content} />
                ) : (
                    <div className="mt-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className="flex gap-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end"></CardFooter>
        </Card>
    );
}
