import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Help",
	description: "Help Portal",
};

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	return children;
};

export default ProtectedLayout;
