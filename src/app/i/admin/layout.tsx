import options from "@/app/api/auth/[...nextauth]/options";
import AccessControl from "@/lib/auth/policy-decision-point";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
	children: ReactNode;
}

const LayoutAdmin = async ({ children }: Props) => {
	const session = await getServerSession(options);
	if (!session) {
		toast.error("You must be logged in to view this page.");
		redirect("/login");
	}
	const accessControl = new AccessControl(session);

	// role-based exemple:
	if (!accessControl.hasRoleAccess("READ", "admin-users")) {
		redirect("/i?error=You do not have permission to view this page!");
	}

	// attribute-based exemple:
	if (!accessControl.hasAttributeAccess("organization", "harris-pye")) {
		redirect("/i?error=You do not have permission to view this page!");
	}

	// or simply check if the user is an admin:
	if (!accessControl.isAdmin()) {
		redirect("/i?error=You do not have permission to view this page!");
	}

	return children;
};

export default LayoutAdmin;
