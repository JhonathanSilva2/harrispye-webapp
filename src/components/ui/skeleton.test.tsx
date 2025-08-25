import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
    it("renders a div with default classes", () => {
        render(<Skeleton data-testid="skeleton" />);
        const el = screen.getByTestId("skeleton");
        expect(el).toBeInTheDocument();
        expect(el).toHaveClass("animate-pulse", "rounded-md", "bg-primary/10");
    });

    it("accepts and merges className prop", () => {
        render(<Skeleton data-testid="skeleton" className="custom-class" />);
        const el = screen.getByTestId("skeleton");
        expect(el).toHaveClass("custom-class");
        // also still has defaults
        expect(el).toHaveClass("animate-pulse", "rounded-md");
    });

    it("forwards arbitrary props to the div", () => {
        render(<Skeleton data-testid="skeleton" title="my-title" />);
        const el = screen.getByTestId("skeleton");
        expect(el).toHaveAttribute("title", "my-title");
    });

    it("renders children when provided", () => {
        render(<Skeleton data-testid="skeleton">Loading...</Skeleton>);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
