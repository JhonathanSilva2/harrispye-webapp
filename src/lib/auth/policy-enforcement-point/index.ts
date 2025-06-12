import { TAccessControlAction } from "@/app/types";
import { permissions } from "@prisma/client";
import { UserSession } from "next-auth";

/**
 * Validates the presence of a user session.
 *
 * @param user - The user session object to validate. Can be `undefined`.
 * @returns `true` if the user session is defined, otherwise `false`.
 */
const userValidation = (user: UserSession | undefined) => {
    if (!user) return false;
    return true;
};
/**
 * @description Action is the operation that the user is trying to perform
 * It will be all the CRUD operations
 */
export const ACTION: TAccessControlAction[] = [
    "READ",
    "WRITE",
    "DELETE",
    "EDIT",
    "ALL",
];
export type TResource = permissions["permission"];
/**
 * Enforces Role-Based Access Control (RBAC) policies by determining whether a user
 * has the necessary permissions to perform a specified action on a given resource.
 *
 * @param user - The user session object, which may be undefined if the user is not authenticated.
 * @param action - The action the user is attempting to perform.
 * @param resource - The resource the user is attempting to access.
 * @returns A promise that resolves to `true` if the user has permission to perform the action
 *          on the resource, or `false` otherwise.
 */
export function RBACPolicyEnforcementPoint(
    user: UserSession | undefined,
    action: TAccessControlAction,
    resource: TResource,
) {
    if (!userValidation(user)) return false;
    if (user!.is_admin) return true;
    const hasFeature = user!.userAccessControl?.find(
        (accessControl) => accessControl.feature === resource,
    );
    if (!hasFeature) return false;

    if (
        (hasFeature && hasFeature.action === action) ||
        (hasFeature && hasFeature.action === "ALL")
    )
        return true;

    return false;
}

/**
 * Enforces Attribute-Based Access Control (ABAC) policies by checking if a user's
 * specific attribute matches a given value.
 *
 * @param user - The user session object, which may be undefined.
 * @param attribute - The key of the user attribute to validate.
 * @param value - The expected value of the specified user attribute.
 * @returns A promise that resolves to `true` if the user's attribute matches the given value,
 *          or `false` otherwise.
 */
export function ABACPolicyEnforcementPoint(
    user: UserSession | undefined,
    attribute: string,
    value: string,
) {
    if (!userValidation(user)) return false;
    if (user!.is_admin) return true;
    const userAttributes = user?.userAttributes as Record<
        string,
        string | number | boolean | null | undefined
    >;
    if (!userAttributes || typeof userAttributes !== "object") return false;

    // Check if the attribute exists in userAttributes and matches the value
    if (attribute in userAttributes) {
        const attributeValue = userAttributes?.[attribute];
        return attributeValue === value;
    }

    return false;
}
