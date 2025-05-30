import { clientEnv } from "@/lib/constants/config";
import {
	ChevronUp,
	LogOutIcon,
	Settings,
	UserCircle2,
	UserRound,
} from "lucide-react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";

interface LoadingMenuButtonProps
	extends React.ComponentPropsWithoutRef<"button"> {
	children: React.ReactNode;
	isLoading?: boolean;
}

const LoadingMenuButton = React.forwardRef<
	HTMLButtonElement,
	LoadingMenuButtonProps
>(({ children, isLoading, ...props }, ref) => {
	return isLoading ? (
		<SidebarMenuButton ref={ref} {...props} className="animate-pulse">
			{children}
		</SidebarMenuButton>
	) : (
		<SidebarMenuButton ref={ref} {...props}>
			{children}
		</SidebarMenuButton>
	);
});

LoadingMenuButton.displayName = "LoadingMenuButton";

const FooterSidebar = () => {
	const [username, setUsername] = useState("Username");
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getSession()
			.then((session) =>
				session
					? setUsername(session.user?.display_name || "Username")
					: null,
			)
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
						<DropdownMenuTrigger asChild>
							<LoadingMenuButton isLoading={isLoading}>
								<UserCircle2 />
								{username}
								<ChevronUp className="ml-auto" />
							</LoadingMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							className="w-[--radix-popper-anchor-width] cursor-pointer"
						>
							<Link
								href={`${clientEnv.NEXT_PUBLIC_URL}/i/profile`}
							>
								<DropdownMenuItem
									onClick={() => setIsOpen(false)}
								>
									<UserRound />
									Profile
								</DropdownMenuItem>
							</Link>
							<Link
								href={`${clientEnv.NEXT_PUBLIC_URL}/i/settings`}
							>
								<DropdownMenuItem
									onClick={() => setIsOpen(false)}
								>
									<Settings />
									Settings
								</DropdownMenuItem>
							</Link>
							<Link
								href={`${clientEnv.NEXT_PUBLIC_URL}/auth/signout`}
							>
								<DropdownMenuItem
									onClick={() => setIsOpen(false)}
								>
									<LogOutIcon />
									Logout
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
};

export default FooterSidebar;
