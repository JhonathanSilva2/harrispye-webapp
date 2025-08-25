import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));
jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));
jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
    },
}));
jest.mock("@/lib/constants/config", () => ({
    clientEnv: {
        NEXT_PUBLIC_URL: "http://localhost",
    },
}));

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/login-form";

type UI = {
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    forgotPasswordLink: HTMLAnchorElement;
};

const setup = (): UI => {
    render(<LoginForm />);
    return {
        emailInput: screen.getByLabelText(/email/i) as HTMLInputElement,
        passwordInput: screen.getByLabelText(/password/i) as HTMLInputElement,
        submitButton: screen.getByRole("button", {
            name: /login/i,
        }) as HTMLButtonElement,
        forgotPasswordLink: screen.getByRole("link", {
            name: /forgot password/i,
        }) as HTMLAnchorElement,
    };
};

describe("LoginForm", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it("renders login form controls", () => {
        const { emailInput, passwordInput, submitButton, forgotPasswordLink } =
            setup();

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink.href).toContain(
            "http://localhost/auth/forgot-password",
        );
    });

    it("shows validation errors when submitting empty fields", async () => {
        const { submitButton } = setup();
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getAllByText("This field has to be filled."),
            ).toHaveLength(2);
        });
    });

    it("calls signIn and redirects on successful login", async () => {
        const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
        const mockedRedirect = redirect as jest.MockedFunction<any>;
        const { emailInput, passwordInput, submitButton } = setup();

        // Prepare a controllable promise so we can assert loading state
        let resolveSignIn: (v: any) => void;
        const signInPromise = new Promise((res) => {
            resolveSignIn = res;
        });
        mockedSignIn.mockReturnValueOnce(signInPromise as any);

        // fill form
        fireEvent.change(emailInput, {
            target: { value: "test@email.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "password" },
        });

        // submit
        fireEvent.click(submitButton);

        // while pending, button should be disabled
        expect(submitButton).toBeDisabled();

        // resolve signIn as successful
        resolveSignIn!({ ok: true, status: 200 });
        await waitFor(() => {
            expect((toast as any).success).toHaveBeenCalledWith(
                "Login successful",
                expect.any(Object),
            );
            expect(mockedRedirect).toHaveBeenCalledWith("/");
        });

        // after completion, button should be enabled
        expect(submitButton).not.toBeDisabled();
    });

    it("shows invalid credentials message when signIn returns 401", async () => {
        const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
        mockedSignIn.mockResolvedValueOnce({ ok: false, status: 401 } as any);

        const { emailInput, passwordInput, submitButton } = setup();

        fireEvent.change(emailInput, {
            target: { value: "user@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "badpass" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect((toast as any).error).toHaveBeenCalled();
            const [title, opts] = (toast as any).error.mock.calls[0];
            expect(title).toBe("Login failed");
            expect(opts).toHaveProperty(
                "description",
                "Invalid email or password",
            );
        });
    });

    it("shows generic error message for non-401 failures", async () => {
        const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
        mockedSignIn.mockResolvedValueOnce({ ok: false, status: 500 } as any);

        const { emailInput, passwordInput, submitButton } = setup();

        fireEvent.change(emailInput, {
            target: { value: "user@example.com" },
        });
        fireEvent.change(passwordInput, {
            target: { value: "badpass" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect((toast as any).error).toHaveBeenCalled();
            const [title, opts] = (toast as any).error.mock.calls[0];
            expect(title).toBe("Login failed");
            expect(opts).toHaveProperty(
                "description",
                "Something went wrong. Try Again Later.",
            );
        });
    });
});
