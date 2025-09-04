import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditDialog } from "./edit-dialog";
import { useFormContext } from "react-hook-form";

// Mocks for external modules used by the component
jest.mock("@/hooks/query/use-fab-mon", () => {
    return {
        useFabMon: jest.fn(),
        useCreateJob: jest.fn(),
        useUpdateJob: jest.fn(),
    };
});

jest.mock("@/components/forms/generic-inputs", () => {
    return {
        __esModule: true,
        default: function GenericInput({ name, label, type }: any) {
            const { register } = useFormContext();
            return (
                <div>
                    <label htmlFor={name}>{label}</label>
                    <input
                        id={name}
                        {...register(name)}
                        type={type || "text"}
                    />
                </div>
            );
        },
    };
});

jest.mock("@/components/alert", () => {
    return {
        __esModule: true,
        AlertDialogComponent: ({ triggerBtn, onConfirm }: any) => {
            // Render the provided triggerBtn but ensure clicking it calls onConfirm
            return React.cloneElement(triggerBtn, { onClick: onConfirm });
        },
    };
});

jest.mock("@/components/ui/button", () => {
    return {
        __esModule: true,
        Button: ({ children, ...props }: any) => (
            <button {...props}>{children}</button>
        ),
    };
});

jest.mock("@/components/ui/dialog", () => {
    return {
        __esModule: true,
        Dialog: ({ children, open, onOpenChange }: any) => (
            <div data-open={open}>{children}</div>
        ),
        DialogContent: ({ children }: any) => <div>{children}</div>,
        DialogDescription: ({ children }: any) => <div>{children}</div>,
        DialogFooter: ({ children }: any) => <div>{children}</div>,
        DialogHeader: ({ children }: any) => <div>{children}</div>,
        DialogTitle: ({ children }: any) => <h2>{children}</h2>,
        DialogTrigger: ({ children }: any) => <div>{children}</div>,
    };
});

jest.mock("@/components/ui/skeleton", () => {
    return {
        __esModule: true,
        Skeleton: ({ "data-testid": dt }: any) => (
            <div data-testid={dt || "skeleton"} />
        ),
    };
});

jest.mock("lucide-react", () => {
    return {
        __esModule: true,
        Loader2: () => <span>loader</span>,
    };
});

import {
    useFabMon,
    useCreateJob,
    useUpdateJob,
} from "@/hooks/query/use-fab-mon";

const mockedUseFabMon = useFabMon as jest.MockedFunction<typeof useFabMon>;
const mockedUseCreateJob = useCreateJob as jest.MockedFunction<
    typeof useCreateJob
>;
const mockedUseUpdateJob = useUpdateJob as jest.MockedFunction<
    typeof useUpdateJob
>;

describe("EditDialog component (form)", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("shows skeletons while loading", () => {
        mockedUseFabMon.mockReturnValue({
            data: undefined,
            isLoading: true,
        } as any);

        const setOpen = jest.fn();
        render(
            <EditDialog
                open={true}
                setOpen={setOpen}
                triggerBtn={<button>open</button>}
                mode="create"
            />,
        );

        // The component renders 6 Skeleton components when loading
        const skeletons = screen.getAllByTestId("skeleton");
        expect(skeletons.length).toBe(6);
    });

    test("renders edit form with job values and submits calling update mutation", async () => {
        const job = {
            hp: "HP-123",
            client: "ACME Corp",
            contract_delivery_date: "2025-08-25T00:00:00.000Z",
            expected_delivery_date: "2025-09-01T00:00:00.000Z",
            po_number: "PO-999",
            client_ref: "MR-111",
        };

        mockedUseFabMon.mockReturnValue({
            data: { data: { job } },
            isLoading: false,
        } as any);

        const mutateAsync = jest.fn().mockResolvedValue({});
        mockedUseUpdateJob.mockReturnValue({ mutateAsync } as any);
        mockedUseCreateJob.mockReturnValue({ mutateAsync: jest.fn() } as any);

        const setOpen = jest.fn();

        const { container } = render(
            <EditDialog
                open={true}
                setOpen={setOpen}
                triggerBtn={<button>open</button>}
                mode="edit"
                hp={job.hp}
            />,
        );

        // Assert inputs are pre-filled with expected values (date fields are formatted to YYYY-MM-DD)
        expect(screen.getByLabelText("HP")).toHaveValue(job.hp);
        expect(screen.getByLabelText("Client Name")).toHaveValue(job.client);
        expect(screen.getByLabelText("Contract Delivery Date")).toHaveValue(
            "2025-08-25",
        );
        expect(screen.getByLabelText("Expect Delivery Date")).toHaveValue(
            "2025-09-01",
        );
        expect(screen.getByLabelText("PO Number")).toHaveValue(job.po_number);
        expect(screen.getByLabelText("CLIENT REF")).toHaveValue(job.client_ref);

        // Submit the form
        const form = container.querySelector("form") as HTMLFormElement;
        expect(form).toBeTruthy();

        fireEvent.submit(form);

        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledTimes(1);
            // The mutation should be called with the form data (dates in YYYY-MM-DD format)
            expect(mutateAsync).toHaveBeenCalledWith({
                hp: job.hp,
                client: job.client,
                contract_delivery_date: "2025-08-25",
                expected_delivery_date: "2025-09-01",
                po_number: job.po_number,
                client_ref: job.client_ref,
            });
            // After successful mutation, setOpen(false) should be called
            expect(setOpen).toHaveBeenCalledWith(false);
        });
    });

    test("renders create form (no job) with empty defaults", () => {
        // no job data, not loading
        mockedUseFabMon.mockReturnValue({
            data: undefined,
            isLoading: false,
        } as any);
        mockedUseCreateJob.mockReturnValue({ mutateAsync: jest.fn() } as any);
        mockedUseUpdateJob.mockReturnValue({ mutateAsync: jest.fn() } as any);

        const setOpen = jest.fn();
        render(
            <EditDialog
                open={true}
                setOpen={setOpen}
                triggerBtn={<button>open</button>}
                mode="create"
            />,
        );

        // Inputs should be rendered and start empty
        expect(screen.getByLabelText("HP")).toHaveValue("");
        expect(screen.getByLabelText("Client Name")).toHaveValue("");
        expect(screen.getByLabelText("Contract Delivery Date")).toHaveValue("");
        expect(screen.getByLabelText("Expect Delivery Date")).toHaveValue("");
        expect(screen.getByLabelText("PO Number")).toHaveValue("");
        expect(screen.getByLabelText("CLIENT REF")).toHaveValue("");
        expect(screen.getByLabelText("Shutdown ID")).toHaveValue("");
    });
});
