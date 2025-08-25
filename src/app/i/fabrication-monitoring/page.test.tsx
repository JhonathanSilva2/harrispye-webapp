import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getServerSession } from "next-auth";
import FabricationMonitoringPage from "./page";

jest.mock("next-auth", () => ({
    __esModule: true,
    getServerSession: jest.fn(),
}));

jest.mock("@/app/api/auth/[...nextauth]/options", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("./_components/fab-mon-jobs-table", () => ({
    __esModule: true,
    default: ({ session }: any) => (
        <div data-testid="fabmon-table">{session?.user?.name ?? "no-name"}</div>
    ),
}));

describe("FabricationMonitoringPage", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows login message when there is no session", async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const element = await FabricationMonitoringPage({
            searchParams: {},
        } as any);
        render(element);

        expect(
            screen.getByText("You must be logged in to access this page."),
        ).toBeInTheDocument();
    });

    it("renders FabMonJobsTable when session exists", async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { name: "Alice" },
        });

        const element = await FabricationMonitoringPage({
            searchParams: {},
        } as any);
        render(element);

        expect(screen.getByTestId("fabmon-table")).toHaveTextContent("Alice");
    });
});
