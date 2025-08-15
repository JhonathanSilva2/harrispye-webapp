import React, { useState, useMemo } from "react";
import {
    EditButtonToggle,
    useEditToggle,
} from "@/components/edit-button-toggle";
import AttributesSearchBox from "./attributes-search-box";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import BadgeAttributes from "./badge-attributes";
import {
    useAllAttributes,
    useUserAttributes,
    useUpdateUserAttributes,
} from "@/hooks/query/use-attributes";

// Define the payload type for updating user attributes
type UpdateUserAttributesPayload = {
    department_id?: number | null;
    localization_id?: number | null;
    organization_id?: number | null;
    role_id?: number | null;
    clearance?: string | null;
};

type AttributeKeys =
    | "departments"
    | "localizations"
    | "organizations"
    | "roles"
    | "clearances";

interface AttributeRow {
    key: AttributeKeys;
    placeholder: string;
    value: string | null;
    data: { label: string; value: string }[];
}

const UserAttributes = ({ userId }: { userId: number }) => {
    const { isEditing, toggle } = useEditToggle();
    const { data, isError, isLoading } = useAllAttributes();
    const { data: userAttributes } = useUserAttributes(userId);
    const { mutate: updateUserAttributes } = useUpdateUserAttributes(userId);

    if (data)
        data["clearances"] = [
            { id: 1, clearances: "HIGH" },
            { id: 2, clearances: "MEDIUM" },
            { id: 3, clearances: "LOW" },
        ];

    const formatAttributes = React.useCallback(
        (key: AttributeKeys) => {
            if (!data) return [];
            const items = data[key];
            const labelKeys: Record<AttributeKeys, string> = {
                departments: "department",
                localizations: "localization",
                organizations: "organization",
                roles: "role",
                clearances: "clearance",
            };
            if (!items) return [];
            const labelKey = labelKeys[key] as keyof (typeof items)[0];
            return items.map((item) => ({
                label: String(item[labelKey]),
                value: String(typeof item === "string" ? item : item.id),
            }));
        },
        [data],
    );

    const selectedAttributes = userAttributes ?? {
        department_id: null,
        localization_id: null,
        organization_id: null,
        role_id: null,
        clearance: null,
    };
    const attributeRows: AttributeRow[] = [
        {
            key: "departments",
            placeholder: "Departments:",
            value: selectedAttributes.department_id
                ? formatAttributes("departments").find(
                      (d) =>
                          d.value === String(selectedAttributes.department_id),
                  )?.label || null
                : null,
            data: formatAttributes("departments"),
        },
        {
            key: "localizations",
            placeholder: "Localizations:",
            value: selectedAttributes.localization_id
                ? formatAttributes("localizations").find(
                      (d) =>
                          d.value ===
                          String(selectedAttributes.localization_id),
                  )?.label || null
                : null,
            data: formatAttributes("localizations"),
        },
        {
            key: "organizations",
            placeholder: "Organizations:",
            value: selectedAttributes.organization_id
                ? formatAttributes("organizations").find(
                      (d) =>
                          d.value ===
                          String(selectedAttributes.organization_id),
                  )?.label || null
                : null,
            data: formatAttributes("organizations"),
        },
        {
            key: "roles",
            placeholder: "Roles:",
            value: selectedAttributes.role_id
                ? formatAttributes("roles").find(
                      (d) => d.value === String(selectedAttributes.role_id),
                  )?.label || null
                : null,
            data: formatAttributes("roles"),
        },
        {
            key: "clearances",
            placeholder: "Clearance:",
            value: selectedAttributes.clearance,
            data: [
                {
                    label: "HIGH",
                    value: "HIGH",
                },
                {
                    label: "MEDIUM",
                    value: "MEDIUM",
                },
                {
                    label: "LOW",
                    value: "LOW",
                },
            ],
        },
    ];

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading Attributes</div>;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Attributes</DialogTitle>
                <DialogDescription>
                    Make changes to User&apos;s Attributes here. Click save when
                    you&apos;re done.
                </DialogDescription>
            </DialogHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Attribute</TableHead>
                        <TableHead className="text-end">Value</TableHead>
                        <TableHead className="text-end">
                            <EditButtonToggle
                                isEditing={isEditing}
                                toggle={toggle}
                                disabled={isLoading}
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attributeRows.map(({ key, placeholder, value, data }) => {
                        const field =
                            `${key.slice(0, -1)}${key === "clearances" ? "" : "_id"}` as keyof UpdateUserAttributesPayload;
                        // console.log({
                        //     key,
                        //     field,
                        //     selectedAtt: selectedAttributes[field],
                        // });
                        return (
                            <TableRow key={key}>
                                <TableCell>
                                    <AttributesSearchBox
                                        placeholder={placeholder}
                                        isEditing={isEditing}
                                        value={value}
                                        data={data}
                                        onSearch={(selectedValue) => {
                                            if (selectedValue !== undefined) {
                                                // Atualiza no backend apenas o campo alterado
                                                updateUserAttributes({
                                                    [field]:
                                                        field === "clearance"
                                                            ? selectedValue
                                                            : Number(
                                                                  selectedValue,
                                                              ),
                                                });
                                            }
                                        }}
                                    />
                                </TableCell>
                                <BadgeAttributes
                                    loading={isLoading || !userAttributes}
                                    attribute={
                                        data.find(
                                            (item) =>
                                                item.value ===
                                                String(
                                                    selectedAttributes[field],
                                                ),
                                        )?.label || null
                                    }
                                />
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </DialogContent>
    );
};

export default UserAttributes;
