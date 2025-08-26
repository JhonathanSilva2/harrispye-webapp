import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getServerSession } from "next-auth";
import { fetchPermissions } from "./_actions/fetch-permissions";
import JobPage from "./page";

jest.mock("next-auth", () => ({
    __esModule: true,
    getServerSession: jest.fn(),
}));

jest.mock("@/app/api/auth/[...nextauth]/options", () => ({
    __esModule: true,
    default: {},
}));

jest.mock("../_components/fab-mon-jobs-table", () => ({
    __esModule: true,
    default: ({ session }: any) => (
        <div data-testid="fabmon-table">{session?.user?.name ?? "no-name"}</div>
    ),
}));

jest.mock("./_components/fab-mon-spools", () => ({
    __esModule: true,
    default: ({ hp, session, permissions }: any) => (
        <div data-testid="fabmon-spools">
            {hp}-{session?.user?.name ?? "no-name"}-
            {permissions?.role ?? "no-perm"}
        </div>
    ),
}));

jest.mock("./_actions/fetch-permissions", () => ({
    __esModule: true,
    fetchPermissions: jest.fn(),
}));

describe("JobPage", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows login message when there is no session", async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);
        (fetchPermissions as jest.Mock).mockResolvedValue({
            ok: true,
            data: { role: "user" },
        });

        const element = await JobPage({
            searchParams: {},
            params: Promise.resolve({ job: "HP1" }),
        } as any);
        render(element);

        expect(
            screen.getByText("You must be logged in to access this page."),
        ).toBeInTheDocument();
    });

    it("shows not authorized message when permissions invalid", async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { name: "Bob" },
        });
        // Simulate permissions response that triggers unauthorized branch
        (fetchPermissions as jest.Mock).mockResolvedValue({
            ok: true,
            data: { error: "no-access" },
        });

        const element = await JobPage({
            searchParams: {},
            params: Promise.resolve({ job: "HP2" }),
        } as any);
        render(element);

        expect(
            screen.getByText("You're not authorized to access this page."),
        ).toBeInTheDocument();
    });

    it("renders FabMonSpoolsTable when session and permissions ok", async () => {
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { name: "Alice" },
        });
        (fetchPermissions as jest.Mock).mockResolvedValue({
            ok: true,
            data: { role: "admin" },
        });

        const element = await JobPage({
            searchParams: {},
            params: Promise.resolve({ job: "HP123" }),
        } as any);
        render(element);

        expect(screen.getByTestId("fabmon-spools")).toHaveTextContent(
            "HP123-Alice-admin",
        );
    });
});
