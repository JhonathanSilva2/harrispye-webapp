import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset Password",
};

const ResetPasswordLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <>{children}</>;
};

export default ResetPasswordLayout;
