import { PageProps } from "@/app/types";
import FabMonJobsTable from "./_components/fab-mon-jobs-table";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import AccessControl from "@/lib/auth/policy-decision-point";

const FabricationMonitoringPage = async ({ searchParams }: PageProps) => {
    const session = await getServerSession(options);
    if (!session) {
        return null;
    }
    const accessControl = new AccessControl(session);
    const hasAccess = accessControl.isSomeAccess("fabrication-monitoring");
    if (!hasAccess && !accessControl.isAdmin()) {
        redirect("/i");
    }

    return <FabMonJobsTable />;
};
export default FabricationMonitoringPage;
