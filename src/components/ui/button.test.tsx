import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "./button";

describe("Button component", () => {
    it("renders default button with default variant and size classes", () => {
        render(<Button>Click</Button>);
        const btn = screen.getByRole("button", { name: /click/i });
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveClass(...buttonVariants({}).split(/\s+/));
    });

    it("applies variant and size classes", () => {
        render(
            <Button variant="destructive" size="icon">
                X
            </Button>,
        );
        const btn = screen.getByRole("button", { name: /x/i });
        expect(btn).toHaveClass(
            ...buttonVariants({ variant: "destructive", size: "icon" }).split(
                /\s+/,
            ),
        );
    });

    it("appends custom className", () => {
        render(<Button className="custom-class">Label</Button>);
        const btn = screen.getByRole("button", { name: /label/i });
        expect(btn).toHaveClass("custom-class");
        // Still includes base classes
        expect(btn).toHaveClass(...buttonVariants({}).split(/\s+/));
    });

    it("forwards ref to the underlying button element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Ref</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        expect(ref.current?.tagName).toBe("BUTTON");
    });

    it("renders as child (Slot) and applies classes to the child element", () => {
        render(
            <Button asChild>
                <a data-testid="link" href="/test">
                    Link
                </a>
            </Button>,
        );
        const link = screen.getByTestId("link");
        expect(link).toBeInstanceOf(HTMLAnchorElement);
        expect(link).toHaveAttribute("href", "/test");
        expect(link).toHaveClass(...buttonVariants({}).split(/\s+/));
    });

    it("calls onClick when clicked and does not call when disabled", async () => {
        const user = userEvent.setup();
        const handle = jest.fn();
        render(<Button onClick={handle}>ClickMe</Button>);
        const btn = screen.getByRole("button", { name: /clickme/i });
        await user.click(btn);
        expect(handle).toHaveBeenCalledTimes(1);

        const handle2 = jest.fn();
        render(
            <>
                <Button onClick={handle2} disabled>
                    Disabled
                </Button>
            </>,
        );
        const disabledBtn = screen.getByRole("button", { name: /disabled/i });
        expect(disabledBtn).toBeDisabled();
        await user.click(disabledBtn);
        expect(handle2).not.toHaveBeenCalled();
    });
});
