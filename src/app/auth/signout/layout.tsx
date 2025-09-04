import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Logout",
    description: "Logout to Portal",
};

const LogoutLayout = async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default LogoutLayout;
