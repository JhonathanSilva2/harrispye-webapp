import { SidebarItem } from "@/components/app-sidebar/types";
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "../ui/sidebar";
import { SidebarItemCollapsible } from "./sidebar-collapse-item";
import { SidebarItemNormal } from "./sidebar-normal-item";

interface SidebarGroupComponentProps {
	modules: SidebarItem[];
}

const SidebarGroupComponent = ({ modules }: SidebarGroupComponentProps) => {
	const collapsibleItems = modules.filter((module) => module.content);
	const normalItems = modules.filter((module) => !module.content);

	return (
		<>
			{normalItems.length > 0 && (
				<SidebarGroup className="!pb-0">
					<SidebarGroupContent>
						<SidebarMenu>
							{normalItems.map((module) => (
								<SidebarItemNormal
									key={module.title}
									item={module}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			)}

			{collapsibleItems.map((module) => (
				<SidebarItemCollapsible key={module.title} item={module} />
			))}
		</>
	);
};

export default SidebarGroupComponent;
