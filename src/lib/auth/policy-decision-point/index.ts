import { TAccessControlAction } from "@/app/types"; // Verify this path and type definition
import { Session } from "next-auth";
import {
    ABACPolicyEnforcementPoint,
    RBACPolicyEnforcementPoint,
    TResource,
} from "../policy-enforcement-point"; // Ensure this path and exports are correct

/**
 * Evaluates a Role-Based Access Control (RBAC) policy decision for a given user session,
 * action, and resource. This function acts as a Policy Decision Point (PDP) in the RBAC
 * model, delegating the enforcement logic to the Policy Enforcement Point (PEP).
 *
 * @param session - The user session object containing information about the authenticated user.
 * @param action - The action being performed, typically represented as a string or enumeration.
 * @param resource - The resource being accessed, typically represented as a string or object.
 * @returns The result of the RBAC policy enforcement, indicating
 *          whether the action is allowed or denied.
 */
export function RBACPolicyDecisionPoint(
    session: Session,
    action: TAccessControlAction,
    resource: TResource,
) {
    return RBACPolicyEnforcementPoint(session?.user, action, resource);
}

/**
 * Evaluates an Attribute-Based Access Control (ABAC) policy decision point.
 * This function determines whether a user has the necessary attribute to access a resource
 * by delegating the evaluation to the ABAC Policy Enforcement Point.
 *
 * @param session - The current user session containing user information.
 * @param attribute - The attribute to be checked for access control.
 * @param value - The expected value of the attribute for access to be granted.
 * @returns The result of the policy enforcement point evaluation indicating
 *          whether the access is allowed or denied.
 */
export function ABACPolicyDecisionPoint(
    session: Session,
    attribute: string,
    value: string,
) {
    return ABACPolicyEnforcementPoint(session?.user, attribute, value);
}

/**
 * The `AccessControl` object provides methods to evaluate role-based and attribute-based
 * access control policies. It requires a valid `Session` object to be initialized.
 *
 * @property _session - The session object used for access control evaluations.
 *
 * @method constructor
 * Initializes the `AccessControl` object with a given session.
 * @param session - The session object required for access control.
 * @throws {Error} If the session is not provided.
 *
 * @method hasRoleAccess
 * Evaluates role-based access control (RBAC) policies for a given action and resource.
 * @param action - The action to be performed, represented as a `TAccessControlAction`.
 * @param resource - The resource to be accessed, represented as a `TResource`.
 * @returns A boolean indicating whether access is granted.
 *
 * @method hasAttributeAccess
 * Evaluates attribute-based access control (ABAC) policies for a given attribute and value.
 * @param attribute - The attribute to be checked.
 * @param value - The value of the attribute to be validated.
 * @returns A boolean indicating whether access is granted.
 */
class AccessControl {
    _session: Session;
    _actions = {
        READ: "READ",
        WRITE: "WRITE",
        EDIT: "EDIT",
        DELETE: "DELETE",
    };
    constructor(session: Session) {
        if (!session)
            throw new Error(
                "Session is required to initialize the AccessControl object.",
            );
        this._session = session;
    }
    isAdmin() {
        return this._session.user.is_admin;
    }
    checkAccessControlActions(resource: TResource) {
        const actionsResponse: Record<string, boolean> = {};
        for (const action of Object.values(this._actions)) {
            if (this.hasRoleAccess(action as TAccessControlAction, resource)) {
                actionsResponse[action] = true;
            } else {
                actionsResponse[action] = false;
            }
        }
        return actionsResponse;
    }
    isSomeAccess(resource: TResource) {
        const actions = this.checkAccessControlActions(resource);
        return Object.values(actions).some((value) => value);
    }

    hasRoleAccess(action: TAccessControlAction, resource: TResource) {
        return RBACPolicyDecisionPoint(
            this._session as Session,
            action,
            resource,
        );
    }
    hasAttributeAccess(attribute: string, value: string) {
        return ABACPolicyDecisionPoint(
            this._session as Session,
            attribute,
            value,
        );
    }
    getRole() {
        return this._session.user.role || "guest";
    }
}

export default AccessControl;
