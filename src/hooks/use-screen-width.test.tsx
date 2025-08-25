import React from "react";
import { render, screen, act } from "@testing-library/react";
import useClientDevice from "./use-screen-width";

const TestComponent = () => {
    const { screenWidth, isMobile } = useClientDevice();
    return (
        <div>
            <span data-testid="width">{screenWidth}</span>
            <span data-testid="mobile">{isMobile ? "true" : "false"}</span>
        </div>
    );
};

describe("useClientDevice hook (use-screen-width)", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("initial state uses window.innerWidth and defaults isMobile to false", () => {
        // set initial window width
        (global as any).innerWidth = 1200;

        render(<TestComponent />);

        expect(screen.getByTestId("width").textContent).toBe("1200");
        // hook's initial isMobile state is false by implementation
        expect(screen.getByTestId("mobile").textContent).toBe("false");
    });

    test("updates screenWidth and isMobile on window resize", () => {
        // start with desktop width
        (global as any).innerWidth = 1400;
        render(<TestComponent />);

        expect(screen.getByTestId("width").textContent).toBe("1400");
        expect(screen.getByTestId("mobile").textContent).toBe("false");

        // resize to mobile width (<= 1024)
        act(() => {
            (global as any).innerWidth = 800;
            window.dispatchEvent(new Event("resize"));
        });

        expect(screen.getByTestId("width").textContent).toBe("800");
        expect(screen.getByTestId("mobile").textContent).toBe("true");

        // resize back to larger width
        act(() => {
            (global as any).innerWidth = 1600;
            window.dispatchEvent(new Event("resize"));
        });

        expect(screen.getByTestId("width").textContent).toBe("1600");
        expect(screen.getByTestId("mobile").textContent).toBe("false");
    });

    test("registers and removes resize event listener in effect cleanup", () => {
        const addSpy = jest.spyOn(window, "addEventListener");
        const removeSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = render(<TestComponent />);

        expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });
});
