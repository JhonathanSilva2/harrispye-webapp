import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Recover Password",
};

interface Props {
    children: React.ReactNode;
}

const ForgotPasswordLayout = ({ children }: Props) => {
    return <>{children}</>;
};

export default ForgotPasswordLayout;
