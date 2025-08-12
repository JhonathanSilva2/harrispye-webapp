// hooks/useAccessControl.ts
import { useEffect, useMemo, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import AccessControl from "@/lib/auth/policy-decision-point";

export function useAccessControl() {
    const [loading, setLoading] = useState(true);
    const [accessControl, setAccessControl] = useState<AccessControl | null>(
        null,
    );

    useEffect(() => {
        getSession().then((s) => {
            if (!s) {
                setLoading(false);
                return;
            }
            setAccessControl(new AccessControl(s));
            setLoading(false);
        });
    }, []);

    return { accessControl, loading };
}
