import type { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PageAuthMiddleware(
    request: NextRequest,
    pathname: string,
    token: JWT | null,
) {
    if (pathname.startsWith("/i") && (!token || !token.ativo)) {
        return NextResponse.redirect(
            new URL("/auth/signin?error=Unauthorized", request.url),
        );
    }
    return null;
}

export async function ApiAuthMiddleware(pathname: string, token: JWT | null) {
    if (process.env.NODE_ENV !== "production") {
        return null; // Skip authentication in development mode
    }
    if (pathname.startsWith("/api") && (!token || !token.ativo)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return null;
}
