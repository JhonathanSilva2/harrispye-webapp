import { PageProps } from "@/app/types";
import { Searchable } from "@/components/data-table/types";
import FabMonTable from "./_components/fab-mon-spools";
import { getServerSession } from "next-auth";
import options from "@/app/api/auth/[...nextauth]/options";
import { fetchPermissions } from "./_actions/fetch-permissions";

export default async function JobPage({ searchParams, params }: PageProps) {
    const advancedSearch: Searchable[] = [
        {
            key: "id",
            type: "text",
            title: "ID",
        },
    ];

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

    const permissions = await fetchPermissions();

    if (!permissions.ok) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">{"Failed to fetch permissions."}</p>
            </div>
        );
    }

    if (!permissions.data || "error" in permissions.data) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">{"Failed to fetch permissions."}</p>
            </div>
        );
    }

    const hp = (await params).job;

    return (
        <FabMonTable hp={hp} session={session} permissions={permissions.data} />
    );
}
