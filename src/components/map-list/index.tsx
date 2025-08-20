"use client";
import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "../ui/breadcrumb";

import { usePathname } from "next/navigation";

{
    /* breadcrumb => https://ui.shadcn.com/docs/components/breadcrumb */
}

const formatBreadcrumb = (text: string) => {
    if (text === "i") return "Home";
    return text
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const BreadCrumb = () => {
    const pathname = usePathname();
    const pathnames = pathname.split("/").filter((x) => x);

    return (
        <Breadcrumb className="z-40 ml-2 pt-1">
            <BreadcrumbList>
                {pathnames.map((link, index) => {
                    const url = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const linkName = formatBreadcrumb(link);
                    const isLast = index === pathnames.length - 1;

                    return (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{linkName}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={url}>
                                        {linkName}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadCrumb;
