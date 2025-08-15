import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRolesCard } from "@/components/user/user-roles-card";
import { getServerSession } from "next-auth";
import options from "../api/auth/[...nextauth]/options";
import { UserAttributes } from "../types";

export default async function DashboardPage() {
    const session = await getServerSession(options);
    if (!session) {
        return null;
    }

    const isAdmin = session.user.is_admin;
    const attributes: UserAttributes | null = session?.user?.userAttributes;
    const roles = session?.user?.userAccessControl;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold">
                Welcome
                {session?.user?.display_name ? `, ${session.user.name}` : ""}!
            </h1>

            {isAdmin && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <UserRolesCard
                        roles={roles}
                        attributes={attributes}
                        isAdmin={isAdmin}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold">5</p>
                            <pre>{JSON.stringify(session.user, null, 4)}</pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold">2 Critical</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
