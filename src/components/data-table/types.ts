import { HeaderContext, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		hp?: string;
		isEditing: boolean;
	}
	interface ColumnMeta<TData extends RowData, TValue> {
		className: string;
	}
}

export interface HeaderCellProps<DataType> {
	header: string;
	headerProps: HeaderContext<DataType, unknown>;
}

export type Searchable = {
	key: string;
	type: "text" | "number" | "date";
	title: string;
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
