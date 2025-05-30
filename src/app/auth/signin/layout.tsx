import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Login",
	description: "Login to Portal",
};

const LoginLayout = async ({ children }: { children: React.JSX.Element }) => {
	return <>{children}</>;
};

export default LoginLayout;
