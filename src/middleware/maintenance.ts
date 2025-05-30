import { NextRequest, NextResponse } from "next/server";

export const MaintenanceMiddleware = (
	request: NextRequest,
	pathname: string,
) => {
	const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
	const allowedPaths = ["/maintenance"];

	if (
		isMaintenance &&
		!allowedPaths.some((path) => pathname.startsWith(path))
	) {
		const response = NextResponse.redirect(
			new URL("/maintenance", request.url),
		);
		response.headers.set("x-nextjs-status", "503");
		return response;
	}

	return null; // Retorna null se não houver necessidade de redirecionamento
};
