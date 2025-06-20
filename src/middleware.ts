import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "./lib/constants/config";
import { ApiAuthMiddleware, PageAuthMiddleware } from "./middleware/auth";
import { MaintenanceMiddleware } from "./middleware/maintenance";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const maintenanceResponse = MaintenanceMiddleware(request, pathname);
    if (maintenanceResponse) return maintenanceResponse;

    /** test next_public env */
    // Allow GET requests to /api/storage without authentication
    if (!pathname.startsWith("/api/storage")) {
        if (pathname.startsWith("/api") || pathname.startsWith("/i")) {
            const token = await getToken({
                req: request,
                secret: serverEnv.NEXTAUTH_SECRET,
            });
            const pageAuthResponse = await PageAuthMiddleware(
                request,
                pathname,
                token,
            );
            if (pageAuthResponse) return pageAuthResponse;
            const apiAuthResponse = await ApiAuthMiddleware(pathname, token);
            if (apiAuthResponse) return apiAuthResponse;
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/auth|auth|images|maintenance).*)",
    ],
};
