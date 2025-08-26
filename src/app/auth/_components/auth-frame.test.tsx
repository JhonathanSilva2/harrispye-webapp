import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AuthFrame from "@/app/auth/_components/auth-frame";
import React from "react";

jest.mock("@/hooks/use-screen-width", () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useClientDevice from "@/hooks/use-screen-width";
import Image from "next/image";

jest.mock("@/components/file-storage/image", () => ({
    __esModule: true,
    default: (props: any) => (
        <Image
            data-testid="file-storage-image"
            src={`/${props.src}`}
            alt={props.alt}
            width={props.width}
            height={props.height}
        />
    ),
}));

describe("AuthFrame", () => {
    beforeEach(() => {
        (useClientDevice as jest.Mock).mockReset();
    });

    it("renders title, description and children", () => {
        (useClientDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(
            <AuthFrame title="Test Title" description="Test description">
                <div>Child Content</div>
            </AuthFrame>,
        );

        expect(
            screen.getByRole("heading", { name: /Test Title/i }),
        ).toBeInTheDocument();
        expect(screen.getByText(/Test description/i)).toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
        expect(
            screen.queryByTestId("file-storage-image"),
        ).not.toBeInTheDocument();
    });

    it("shows FileStorageImage when on mobile", () => {
        (useClientDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AuthFrame title="Mobile" description="Mobile desc" />);

        const img = screen.getByTestId("file-storage-image");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("alt", "logo");
    });
});
