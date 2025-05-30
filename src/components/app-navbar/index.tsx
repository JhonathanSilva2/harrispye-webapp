import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../theme-toggle";
import BreadCrumb from "../map-list";

const AppNavbar = () => {
	return (
		<div className="z-45 sticky top-0 mb-2 flex items-center justify-between gap-2 bg-background p-2">
			{/* breadcrumb => https://ui.shadcn.com/docs/components/breadcrumb */}
			<span className="flex">
				<SidebarTrigger />
				<BreadCrumb />
			</span>
			<ThemeToggle />
		</div>
	);
};

export default AppNavbar;
