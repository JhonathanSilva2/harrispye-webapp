import { PageProps } from "@/app/types";
import FabMonJobsTable from "./_components/fab-mon-jobs-table";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import AccessControl from "@/lib/auth/policy-decision-point";

const FabricationMonitoringPage = async ({ searchParams }: PageProps) => {
    return <FabMonJobsTable />;
};
export default FabricationMonitoringPage;
