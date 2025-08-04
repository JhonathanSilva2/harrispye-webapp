import { $Enums, Prisma } from "@/../prisma/generated/client-hp-base";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import { FieldValues, Path } from "react-hook-form";

export interface MockTodo {
    id: number;
    title: string;
    completed: boolean;
}

export type MockTodos = MockTodo[];

export interface UserQuery extends User {
    manager_name: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @var {APICallback} APICallback - The type of the API callback function you want to get the returning type from.
 */
export type ReturnTypeFromAPICall<APICallback extends (...args: any) => any> =
    ReturnType<APICallback> extends Promise<NextResponse<infer T>> ? T : never;
/**
 * @var {APICallback} APICallback - The type of the API callback function you want to get the returning type from.
 */
export type ReturnTypeFromPaginatedApiCall<
    APICallback extends (...args: any) => any,
> =
    ReturnType<APICallback> extends Promise<NextResponse<TPayload<infer T>>>
        ? T
        : never;
/* eslint-enable @typescript-eslint/no-explicit-any */
export interface PageProps {
    params: Promise<StringDictionary>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface FetchPagePaginationProps {
    filters?: Partial<Record<string, string | number>>;
}

export interface StringDictionary {
    [key: string]: string;
}

export interface TPayload<DataType> {
    data: DataType;
    page: number;
    pageSize: number;
    rowCount: number;
}

export type InputType =
    | "text"
    | "textarea"
    | "select"
    | "radio"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "combobox"
    | "date"
    | "file"
    | "datalist"
    | "currency";

export interface GenericInputProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    type?: InputType;
    options?: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    accept?: string;
    disabled?: boolean;
}

export type PaginatedData<T> = {
    result: T[];
    rowCount: number;
};

export type PaginationParams = { pageIndex: number; pageSize: number };
export type SortParams = { sortBy: `${string}.${"asc" | "desc"}` };
export type Filters<T> = Partial<T & PaginationParams & SortParams>;

export interface FetchJobProps extends FetchPagePaginationProps {
    hp: string;
}
// eslint-disable-next-line
export interface UserProfile
    extends Prisma.usersGetPayload<{
        omit: {
            password: true;
            id_perfil: true;
            type_user: true;
        };
        include: { user_attributes: true };
    }> {}
export type UserAttributes = UserFullProfile["userAttributes"];
export interface UserFullProfile
    extends Prisma.usersGetPayload<{
        omit: {
            password: true;
            id_perfil: true;
            type_user: true;
            department: true;
        };
        include: { user_attributes: true };
    }> {
    manager: Prisma.usersGetPayload<{
        select: {
            hp_registration: true;
            display_name: true;
            username: true;
            role: true;
        };
    }> | null;
    department: Prisma.departmentsGetPayload<{
        select: {
            department: true;
        };
    }> | null;
    userAttributes: Prisma.user_attributesGetPayload<{
        select: {
            id: true;
            user_id: true;
            clearance: true;
            organization_id: true;
            localization_id: true;
            department_id: true;
            role_id: true;
            user_departments: {
                select: {
                    id: true;
                    department: true;
                };
            };
            user_localizations: {
                select: {
                    id: true;
                    localization: true;
                };
            };
            user_organizations: {
                select: {
                    id: true;
                    organization: true;
                };
            };
            user_roles: {
                select: {
                    id: true;
                    role: true;
                };
            };
        };
    }> | null;
    userAccessControl: TAccessControl[] | null;
}
export type TAccessControl = {
    action: TAccessControlAction;
    feature: string;
};
export type TAccessControlAction = $Enums.user_access_control_action;
