import { SidebarItem } from "@/components/app-sidebar/types";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface SidebarItemNormalProps {
	item: SidebarItem;
}

export const SidebarItemNormal = ({ item }: SidebarItemNormalProps) => {
	return (
		<SidebarMenuItem key={item.title}>
			{item.onClick ? (
				<SidebarMenuButton onClick={item.onClick}>
					<item.icon />
					<span>{item.title}</span>
				</SidebarMenuButton>
			) : (
				<SidebarMenuButton asChild>
					<Link href={item.url || "#"}>
						<item.icon />
						<span>{item.title}</span>
					</Link>
				</SidebarMenuButton>
			)}
		</SidebarMenuItem>
	);
};
