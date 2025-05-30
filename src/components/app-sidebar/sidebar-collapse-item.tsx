import { SidebarItem } from "@/components/app-sidebar/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";

interface SidebarItemCollapsibleProps {
	item: SidebarItem;
	toggleSidebar?: () => void;
}

export const SidebarItemCollapsible = ({
	item,
}: SidebarItemCollapsibleProps) => {
	return (
		<Collapsible defaultOpen={false} className="group/collapsible">
			<SidebarGroup className="!p-0.5 !ps-2">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger>
						<item.icon className="mr-2" />
						<span className="text-sm font-normal">
							{item.title}
						</span>
						<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{item.content!.map((subItem) => (
								<SidebarMenuItem
									key={subItem.title}
									className="pl-4"
								>
									{subItem.onClick ? (
										<SidebarMenuButton
											onClick={subItem.onClick}
										>
											<subItem.icon />
											<span>{subItem.title}</span>
										</SidebarMenuButton>
									) : (
										<SidebarMenuButton asChild>
											<Link href={subItem.url || "#"}>
												<subItem.icon />
												<span>{subItem.title}</span>
											</Link>
										</SidebarMenuButton>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
};
