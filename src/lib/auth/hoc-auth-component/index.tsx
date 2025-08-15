"use client";

import { TAccessControlAction, XOR } from "@/app/types";
import { Loader2 } from "lucide-react";
import { getSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import AccessControl from "../policy-decision-point";

interface HOCAuthComponentProps {
    children?: JSX.Element;
    enforcePolicy: HOCAuthComponentEnforcePolicy;
}

type HOCAuthComponentEnforcePolicy = XOR<
    {
        roleBasedAccess?: {
            action: TAccessControlAction;
            resource: string;
        };
        attributeBasedAccess?: never;
    },
    {
        roleBasedAccess?: never;
        attributeBasedAccess?: {
            attribute: string;
            value: string;
        };
    }
>;

const HOCAuthComponent = ({
    children,
    enforcePolicy,
}: HOCAuthComponentProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [component, setComponent] = useState<JSX.Element | undefined>(
        undefined,
    );

    useEffect(() => {
        getSession()
            .then((session) => {
                if (!session) {
                    return null;
                }
                const accessControl = new AccessControl(session);
                const { roleBasedAccess, attributeBasedAccess } = enforcePolicy;

                if (roleBasedAccess) {
                    const { action, resource } = roleBasedAccess;
                    if (!accessControl.hasRoleAccess(action, resource)) {
                        return null;
                    }
                }

                if (attributeBasedAccess) {
                    const { attribute, value } = attributeBasedAccess;
                    if (!accessControl.hasAttributeAccess(attribute, value)) {
                        return null;
                    }
                }

                if (!roleBasedAccess && !attributeBasedAccess) {
                    return null;
                }
                setComponent(children);
            })
            .catch((error) => {
                console.error("Error fetching session:", error);
                toast.error("Failed to fetch session. Please try again.");
                return null;
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [enforcePolicy, children]);

    return isLoading ? (
        <div className="flex w-full items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    ) : (
        component
    );
};

export default HOCAuthComponent;
