import { PageProps } from "@/app/types";
import FabMonJobsTable from "./_components/fab-mon-jobs-table";

const FabricationMonitoringPage = async ({ searchParams }: PageProps) => {
    // return <NotImplemented />;
    return <FabMonJobsTable />;
};
export default FabricationMonitoringPage;
