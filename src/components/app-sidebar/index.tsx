"use client";

import { modules } from "@/components/app-sidebar/site-map";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	useSidebar,
} from "../ui/sidebar";
import FooterSidebar from "./footer";
import { SidebarLogo } from "./logo";
import SidebarGroupComponent from "./sidebar-group-component";

/**
 * @warning This is breaking on mobile
 * @docs https://ui.shadcn.com/docs/components/sidebar
 */
const AppSidebar = () => {
	const { state } = useSidebar();
	return (
		<Sidebar
			variant="inset"
			className="fixed left-0 top-0 h-screen bg-gray-900 text-white"
			collapsible="icon"
		>
			<SidebarHeader>
				<SidebarLogo isExpanded={state === "expanded"} />
			</SidebarHeader>
			<SidebarContent className="!gap-0">
				<SidebarGroupComponent modules={modules} />
			</SidebarContent>
			<FooterSidebar />
		</Sidebar>
	);
};

export default AppSidebar;
