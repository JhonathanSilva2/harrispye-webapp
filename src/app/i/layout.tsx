import AppNavbar from "@/components/app-navbar";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
	description: "Home Portal",
};

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="group relative h-screen flex-1 overflow-hidden overflow-y-auto">
				<AppNavbar />
				<div className="mx-2 md:mx-6">{children}</div>
			</main>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
