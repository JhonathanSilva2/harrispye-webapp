// hooks/useAccessControl.ts
import { useEffect, useMemo, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import AccessControl from "@/lib/auth/policy-decision-point";

export function useAccessControl() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession().then((s) => {
            setSession(s);
            setLoading(false);
        });
    }, []);

    const accessControl = useMemo(() => {
        if (!session) return null;
        return new AccessControl(session);
    }, [session]);

    return { accessControl, loading };
}
