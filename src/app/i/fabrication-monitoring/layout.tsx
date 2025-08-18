import options from "@/app/api/auth/[...nextauth]/options";
import AccessControl from "@/lib/auth/policy-decision-point";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { JSX } from "react";

export const metadata: Metadata = {
    title: "Fabrication Monitoring",
    description:
        "Fabrication Monitoring tool to track the progress of fabrication",
};

const FabricationMonitoringLayout = async ({
    children,
}: {
    children: JSX.Element;
}) => {
    const session = await getServerSession(options);
    if (!session) {
        return null;
    }
    const accessControl = new AccessControl(session);
    const hasAccess = accessControl.hasSomeAccess("fabrication-monitoring");
    if (!hasAccess && !accessControl.isAdmin()) {
        redirect("/i");
    }

    return children;
};

export default FabricationMonitoringLayout;
