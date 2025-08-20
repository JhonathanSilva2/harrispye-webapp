import { FabMonSpoolsPermission } from "@/app/api/fabrication-monitoring/permissions/_action/fetch-permission";
import { TPayload } from "@/app/types";
import AccessControl from "@/lib/auth/policy-decision-point";
import {
    ColumnDef,
    HeaderContext,
    OnChangeFn,
    PaginationOptions,
    PaginationState,
    RowData,
    SortingState,
    TableOptions,
} from "@tanstack/react-table";
import { fabrication_monitoring_jobs } from "prisma/generated/client-hp-base";
import { JSX } from "react";
type PermissionValue = "READ" | "UPDATE" | "WRITE" | false;

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        hp?: string;
        isEditing?: boolean;
        FabMonPermissions?: FabMonSpoolsPermission;
        accessControl?: AccessControl;
        job?: fabrication_monitoring_jobs;
    }
    interface ColumnMeta<TData extends RowData, TValue> {
        className: string;
    }
}

export interface DataTableProps<T> {
    searchables?: Searchable[];
    data?: TPayload<T[]>;
    columns: ColumnDef<T>[];
    pagination: PaginationState;
    paginationOptions: Pick<
        PaginationOptions,
        "onPaginationChange" | "rowCount"
    >;
    filters: Record<string, string | number>;
    resetFilters: () => void;
    setFilters: (
        partialFilters: Partial<Record<string, string | number>>,
    ) => void;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    isPending: boolean;
    isError: boolean;
    headerClassName?: string;
    headerComponent?: JSX.Element;
    titleClassName?: string;
    title?: string;
    meta?: TableOptions<T>["meta"];
    unpermittedColumns?: Record<string, boolean> | undefined;
}
export interface HeaderCellProps<DataType> {
    header: string;
    headerProps: HeaderContext<DataType, unknown>;
}

export type Searchable = {
    key: string;
    type: "text" | "number" | "date" | "select";
    title: string;
    options?: { value: string; label: string }[];
};

export interface TFiltersHook {
    filters: Record<string, string | number>;
    setFilters: (
        partialFilters: Partial<Record<string, string | number>>,
    ) => void;
    resetFilters: () => void;
}
export interface AdvancedFilterProps extends TFiltersHook {
    className?: string;
    searchables?: Searchable[];
}
