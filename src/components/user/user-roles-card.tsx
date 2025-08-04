import { TAccessControl, UserAttributes } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

interface UserRolesCardProps {
    roles: TAccessControl[] | null;
    attributes: UserAttributes | null;
    isAdmin: boolean;
}

export function UserRolesCard({
    roles,
    attributes,
    isAdmin,
}: UserRolesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Roles & Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex">
                    <h3 className="mb-2 font-semibold">Is Admin:&nbsp;</h3>
                    <p>{isAdmin ? "Yes" : "No"}</p>
                </div>
                <div>
                    <h3 className="mb-2 font-semibold">Roles:</h3>
                    <div className="flex flex-wrap gap-2">
                        {roles?.map((role) => (
                            <Badge key={role.feature} variant="secondary">
                                {`${role.feature}.${role.action}`}
                            </Badge>
                        )) ?? null}
                    </div>
                </div>

                <div>
                    <div className="flex flex-wrap gap-2">
                        {attributes ? (
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead colSpan={2}>
                                            Attributes
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Attribute</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Localization: </TableCell>
                                        <TableCell>
                                            {attributes.user_localizations?.localization.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Organization: </TableCell>
                                        <TableCell>
                                            {attributes.user_organizations?.organization.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Department: </TableCell>
                                        <TableCell>
                                            {attributes.user_departments?.department.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Role: </TableCell>
                                        <TableCell>
                                            {attributes.user_roles?.role.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Clearance: </TableCell>
                                        <TableCell>
                                            {attributes.clearance.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
