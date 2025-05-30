import { Metadata } from "next";

export const metadata: Metadata = {
	title: "User",
	description: "User Portal",
};

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	return children;
};

export default ProtectedLayout;
