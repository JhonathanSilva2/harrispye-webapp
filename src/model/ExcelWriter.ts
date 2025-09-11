import ExcelJS, { Column, Style } from "exceljs";

export type CellValue = string | number | boolean | Date | null;
type RowData = Record<string, CellValue>;
// Interface for defining columns in declarative mode
export interface ColumnDefinition<T> {
    key: string;
    header: string;
    width?: number;
    format?: string;
    style?: Partial<Style>;
    selector: (item: T) => CellValue;
}

// Interface for defining key-value rows in summary sheets
export interface KeyValueRow {
    description: string;
    value: CellValue;
    format?: string;
}

// The unified configuration interface. You will use one of the "modes" at a time.
export interface ReportConfig<T> {
    name: string;
    useTableFormat?: boolean;

    // MODE 1)
    sourceData?: T[];
    columnDefinitions?: ColumnDefinition<T>[];

    // MODE 2) Key-Value (preferred for summaries)
    keyValueData?: KeyValueRow[];

    // MODE 3) Vertical (for details of a single item)
    verticalTable?: boolean;
    data?: RowData[]; // Used by modes 3 and 4

    // MODE 4) Simple (fallback when others do not apply)
    columns?: Partial<Column>[];

    // Cell formatting (works with any mode)
    cellFormats?: Record<string, string>;
}

export class ExcelWriter {
    private workbook: ExcelJS.Workbook;
    private defaultStyle: Partial<Style>;

    constructor(defaultStyle?: Partial<Style>) {
        this.workbook = new ExcelJS.Workbook();
        this.defaultStyle = defaultStyle ?? {
            font: { name: "Arial", size: 11 },
            alignment: { vertical: "middle", horizontal: "center" },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            },
        };
    }

    /**
     * Entry point that orchestrates which sheet builder to use.
     */
    public addSheet<T>(config: ReportConfig<T>): void {
        const sheet = this.workbook.addWorksheet(config.name);

        if (config.sourceData && config.columnDefinitions) {
            this._buildDeclarativeSheet<T>(sheet, config);
        } else if (config.keyValueData) {
            this._buildKeyValueSheet(sheet, config);
        } else if (config.verticalTable) {
            this._buildVerticalSheet(sheet, config);
        } else {
            this._buildSimpleSheet(sheet, config);
        }

        this._applyCellFormats(sheet, config);
    }
    /**
     * MODE 1) Builds the sheet from raw data and column definitions.
     */
    private _buildDeclarativeSheet<T>(
        sheet: ExcelJS.Worksheet,
        config: ReportConfig<T>,
    ): void {
        const defs = config.columnDefinitions!;

        sheet.columns = defs.map((d) => {
            const style = { ...this.defaultStyle, ...d.style };

            if (config.useTableFormat) {
                delete style.border;
            }

            return {
                key: d.key,
                header: d.header,
                width: d.width ?? 20,
                style: style,
            };
        });

        sheet.columns.forEach((col, index) => {
            if (defs[index].format) {
                col.numFmt = this._getFormatString(defs[index].format!);
            }
        });

        const processedData = config.sourceData!.map((item: T) => {
            const row: RowData = {};
            defs.forEach((d) => {
                row[d.key] = d.selector(item);
            });
            return row;
        });

        if (config.useTableFormat) {
            this._addAsTable(
                sheet,
                processedData,
                defs.map((d) => d.key),
            );
        } else {
            sheet.addRows(processedData);
        }
    }
    /**
     * MODE 2) Builds a summary (key-value) sheet.
     */
    private _buildKeyValueSheet<T>(
        sheet: ExcelJS.Worksheet,
        config: ReportConfig<T>,
    ): void {
        const data = config.keyValueData!;
        sheet.columns = [
            {
                key: "description",
                width: 30,
                style: {
                    font: { bold: true },
                    alignment: { horizontal: "left", vertical: "middle" },
                },
            },
            {
                key: "value",
                width: 20,
                style: { alignment: { vertical: "middle" } },
            },
        ];
        sheet.addRows(
            data.map((row) => ({
                description: row.description,
                value: row.value,
            })),
        );

        const cellFormats: Record<string, string> = {};
        data.forEach((row, index) => {
            if (row.format) {
                cellFormats[`B${index + 1}`] = row.format;
            }
        });
        config.cellFormats = { ...config.cellFormats, ...cellFormats };
    }

    /**
     * MODE 3) Builds a vertical sheet.
     */
    private _buildVerticalSheet<T>(
        sheet: ExcelJS.Worksheet,
        config: ReportConfig<T>,
    ): void {
        if (!config.data?.length) return;
        const data = config.data[0];
        const transformedData = Object.keys(data).map((key) => ({
            property: key.replace(/_/g, " ").toUpperCase(),
            value: data[key],
        }));

        this._buildDeclarativeSheet(sheet, {
            ...config,
            useTableFormat: true,
            sourceData: transformedData,
            columnDefinitions: [
                {
                    key: "property",
                    header: "Job Info",
                    width: 30,
                    selector: (item) => item.property,
                },
                {
                    key: "value",
                    header: "Details",
                    width: 35,
                    selector: (item) => item.value,
                },
            ],
        });

        const blueHeaderStyle: Partial<Style> = {
            font: { bold: true, color: { argb: "FFFFFFFF" } },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "4472C4" },
            },
            alignment: {
                horizontal: "left",
                vertical: "middle",
                ...this.defaultStyle.border,
            },
        };

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const cell = row.getCell(1);
            if (cell.value) {
                cell.style = blueHeaderStyle;
            }
        });
    }

    /**
     * MODE 4) Builds a simple (fallback) sheet.
     */
    private _buildSimpleSheet<T>(
        sheet: ExcelJS.Worksheet,
        config: ReportConfig<T>,
    ): void {
        if (config.columns) {
            sheet.columns = config.columns;
        } else if (config.data?.length) {
            sheet.columns = Object.keys(config.data[0]).map((key) => ({
                key,
                header: key.toUpperCase(),
                width: 20,
            }));
        }

        if (config.data) {
            sheet.addRows(config.data);
        }
    }

    /**
     * Adds formatted data as an Excel Table.
     */
    private _addAsTable(
        sheet: ExcelJS.Worksheet,
        data: RowData[],
        columnKeys: string[],
    ): void {
        sheet.addTable({
            name: `${sheet.name.replace(/\s/g, "")}Table`,
            ref: "A1",
            headerRow: true,
            style: { theme: "TableStyleMedium9", showRowStripes: true },
            columns: sheet.columns.map((col) => ({
                name: col.header as string,
            })),
            rows: data.map((rowData) => columnKeys.map((key) => rowData[key])),
        });
    }

    /**
     * Applies formatting to individual cells.
     */
    private _applyCellFormats<T>(
        sheet: ExcelJS.Worksheet,
        config: ReportConfig<T>,
    ): void {
        if (!config.cellFormats) return;
        for (const [cellRef, formatType] of Object.entries(
            config.cellFormats,
        )) {
            const cell = sheet.getCell(cellRef);
            cell.numFmt = this._getFormatString(formatType);
        }
    }

    /**
     * Converts a format name into its corresponding string in Excel.
     */
    private _getFormatString(formatType: string): string {
        switch (formatType) {
            case "date":
                return "dd/mm/yyyy";
            case "currency":
                return '"R$"#,##0.00';
            case "numeric":
                return "#,##0.00";
            case "integer":
                return "#,##0";
            case "percentage":
                return "0.00%";
            default:
                return "@";
        }
    }

    public async getBuffer(): Promise<ArrayBuffer> {
        return this.workbook.xlsx.writeBuffer();
    }
}
