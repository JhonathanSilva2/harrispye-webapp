import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.JSX.Element }) => {
    return (
        <div className="min-h-screen">
            <div className="container flex min-h-screen max-w-none flex-col items-center justify-center md:grid lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-gray-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {/* Some text here */}
                        </h1>
                    </div>
                    <div className="relative z-20 flex h-full w-full items-center justify-center">
                        <div className="flex flex-col items-center justify-center space-y-8 text-center">
                            <Image
                                src={`/images/vertical-logo.png`}
                                width={300}
                                height={200}
                                alt="logo"
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2 text-center">
                            <p
                                className={cn(
                                    "text-md italic text-muted-foreground",
                                )}
                            >
                                &ldquo;Your hub for efficiency and
                                productivity!&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </div>
                <div className="h-full w-full lg:p-8">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
