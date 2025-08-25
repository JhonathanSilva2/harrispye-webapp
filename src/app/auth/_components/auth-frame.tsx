"use client";

import FileStorageImage from "@/components/file-storage/image";
import useClientDevice from "@/hooks/use-screen-width";
import { cn } from "@/lib/utils";
import { JSX } from "react";

interface Props {
    children?: JSX.Element;
    title: string;
    description: string;
}

const AuthFrame = ({ children, title, description }: Props) => {
    const { isMobile } = useClientDevice();

    return (
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center space-y-2 text-center">
                {isMobile ? (
                    <FileStorageImage
                        className="block lg:hidden"
                        src={`images/logo-icon.png`}
                        width={200}
                        height={200}
                        alt="logo"
                        unoptimized
                    />
                ) : null}
                <h1 className={cn("tracking-tightest text-4xl")}>{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    );
};

export default AuthFrame;
