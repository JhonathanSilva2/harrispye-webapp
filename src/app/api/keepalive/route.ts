// app/api/keepalive/route.ts
import { prismaBase } from "@/db/base-client";
import assert from "assert";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prismaBase.$queryRaw`SELECT 1`;
        return NextResponse.json({ ok: true });
    } catch (err) {
        assert(err instanceof Error);
        console.error("DB keepalive failed", err);
        return NextResponse.json(
            { ok: false },
            {
                status: 500,
            },
        );
    }
}
