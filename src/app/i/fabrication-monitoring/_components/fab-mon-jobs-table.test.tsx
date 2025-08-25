import React from "react";
import { render, screen } from "@testing-library/react";
import FabMonJobsTable from "./fab-mon-jobs-table";
import type { Session } from "next-auth";

// Mocks
const mockUseFilters = jest.fn();
const mockUseFabMonJobs = jest.fn();

jest.mock("@/hooks/use-filters", () => ({
    useFilters: (...args: any[]) => mockUseFilters(...args),
}));

jest.mock("@/hooks/query/use-fab-mon-jobs", () => ({
    useFabMonJobs: (...args: any[]) => mockUseFabMonJobs(...args),
}));

jest.mock("@/components/data-table", () => ({
    DataTable: (props: any) =>
        React.createElement("div", {
            "data-testid": "datatable",
            "data-pagination": JSON.stringify(props.pagination),
            "data-filters": JSON.stringify(props.filters),
        }),
}));

jest.mock("@/lib/auth/policy-decision-point", () =>
    // default export is a class/constructor in original code
    // return a simple constructor that stores the session
    jest.fn().mockImplementation(function (this: any, session: any) {
        this.session = session;
    }),
);

jest.mock("@/lib/constants/pagination", () => ({
    PaginationConstants: {
        DEFAULT_PAGE_INDEX: 0,
        DEFAULT_PAGE_SIZE: 10,
    },
}));

jest.mock("./add-hp", () => ({
    AddHp: () =>
        React.createElement("div", { "data-testid": "add-hp" }, "add-hp"),
}));

jest.mock("./column-def", () => ({
    fabricationMonitoringJobsColumns: [],
}));

// Default return for useFabMonJobs
mockUseFabMonJobs.mockReturnValue({
    data: { rowCount: 0 },
    isError: false,
    isPending: false,
});

describe("FabMonJobsTable pagination initialization", () => {
    const session = {} as Session;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("uses filters.page when provided to compute initial pageIndex (Number(filters.page) - 1)", () => {
        mockUseFilters.mockReturnValue({
            filters: { page: "3", pageSize: "30" },
            resetFilters: jest.fn(),
            setFilters: jest.fn(),
        });

        render(<FabMonJobsTable session={session} />);

        const dt = screen.getByTestId("datatable");
        const pagination = JSON.parse(
            dt.getAttribute("data-pagination") || "{}",
        );

        expect(pagination).toBeDefined();
        // pageIndex should be Number(filters.page) - 1 => 3 - 1 = 2
        expect(pagination.pageIndex).toBe(2);
        // pageSize should come from filters.pageSize
        expect(pagination.pageSize).toBe(30); // ensure presence
        // More strictly: original component sets pageSize via Number(filters.pageSize) when initializing state,
        // but because our mock returns strings and component calls Number, the DataTable receives a numeric pageSize.
        // Validate numeric conversion:
        expect(Number(pagination.pageSize)).toBe(30);
    });

    test("falls back to PaginationConstants defaults when filters.page and pageSize are not provided", () => {
        mockUseFilters.mockReturnValue({
            filters: {},
            resetFilters: jest.fn(),
            setFilters: jest.fn(),
        });

        render(<FabMonJobsTable session={session} />);

        const dt = screen.getByTestId("datatable");
        const pagination = JSON.parse(
            dt.getAttribute("data-pagination") || "{}",
        );

        expect(pagination).toBeDefined();
        // DEFAULT_PAGE_INDEX mocked to 0
        expect(pagination.pageIndex).toBe(0);
        // DEFAULT_PAGE_SIZE mocked to 10
        expect(pagination.pageSize).toBe(10);
    });

    // it still missing tests for sorting and filter behavior
});
