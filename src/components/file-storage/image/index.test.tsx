import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileStorageImage from "./index";

jest.mock("next/image", () => {
    // Return a simple img that maps onLoad -> onLoadingComplete and onError -> onError
    return {
        __esModule: true,
        default: ({ src, alt, onLoadingComplete, onError, ...rest }: any) => {
            return (
                <img
                    data-testid="mock-next-image"
                    src={src}
                    alt={alt}
                    onLoad={() => onLoadingComplete?.()}
                    onError={() => onError?.()}
                    {...rest}
                />
            );
        },
    };
});

jest.mock("@/components/ui/skeleton", () => {
    return {
        __esModule: true,
        Skeleton: (props: any) => <div data-testid="skeleton" {...props} />,
    };
});

jest.mock("@/lib/constants/config", () => ({
    clientEnv: {
        NEXT_PUBLIC_URL: "https://example.test",
    },
}));

describe("FileStorageImage", () => {
    it("constructs image endpoint and shows skeleton while loading, then hides it on load", () => {
        render(
            <FileStorageImage
                src="container/image.png"
                width={100}
                height={100}
                alt="test-image"
            />,
        );

        // skeleton should be present initially
        expect(screen.getByTestId("skeleton")).toBeInTheDocument();

        const img = screen.getByAltText("test-image") as HTMLImageElement;
        expect(img).toBeInTheDocument();
        expect(img.src).toBe(
            "https://example.test/api/storage/container/image.png",
        );

        // simulate load -> should remove skeleton
        fireEvent.load(img);
        expect(screen.queryByTestId("skeleton")).toBeNull();
    });

    it("hides skeleton on image error", () => {
        render(
            <FileStorageImage
                src="container/image.png"
                width={100}
                height={100}
                alt="err-image"
            />,
        );

        // skeleton present initially
        expect(screen.getByTestId("skeleton")).toBeInTheDocument();

        const img = screen.getByAltText("err-image") as HTMLImageElement;
        fireEvent.error(img);

        // skeleton removed after error
        expect(screen.queryByTestId("skeleton")).toBeNull();
    });

    it("throws if src is not provided", () => {
        // @ts-expect-error testing runtime behavior when src is missing
        expect(() => render(<FileStorageImage />)).toThrow(
            "Image source is required.",
        );
    });

    it("throws if src format is invalid", () => {
        expect(() =>
            render(
                <FileStorageImage
                    // invalid format: missing slash between container and filename
                    src="invalidformat"
                    width={100}
                    height={100}
                    alt={""}
                />,
            ),
        ).toThrow(
            "Invalid image source format. Expected format: {container}/{filename.ext}",
        );
    });
});
