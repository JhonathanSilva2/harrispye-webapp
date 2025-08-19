import options from "@/app/api/auth/[...nextauth]/options";
import { PageProps } from "@/app/types";
import { Searchable } from "@/components/data-table/types";
import { getServerSession } from "next-auth";
import { fetchPermissions } from "./_actions/fetch-permissions";
import FabMonSpoolsTable from "./_components/fab-mon-spools";

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

    if (!permissions.ok || !permissions.data || "error" in permissions.data) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">{"You're not authorized to access this page."}</p>
            </div>
        );
    }

    const hp = (await params).job;

    return (
        <FabMonSpoolsTable
            hp={hp}
            session={session}
            permissions={permissions.data}
        />
    );
}
