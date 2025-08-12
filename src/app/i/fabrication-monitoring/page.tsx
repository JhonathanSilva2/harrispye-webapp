import { PageProps } from "@/app/types";
import FabMonJobsTable from "./_components/fab-mon-jobs-table";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";

const FabricationMonitoringPage = async ({ searchParams }: PageProps) => {
    const session = await getServerSession(options);

    if (!session) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">
                    You must be logged in to access this page.
                </p>
            </div>
        );
    }

    return <FabMonJobsTable session={session} />;
};
export default FabricationMonitoringPage;
