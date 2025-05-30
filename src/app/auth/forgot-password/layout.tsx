import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Recover Password",
};

const ForgotPasswordLayout = async ({
	children,
}: {
	children: React.JSX.Element;
}) => {
	return <>{children}</>;
};

export default ForgotPasswordLayout;
