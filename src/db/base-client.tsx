/* eslint-disable no-var */

import { PrismaClient } from "@prisma/client";

let prismaBase: PrismaClient;

declare global {
    var prismaBase: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    prismaBase = new PrismaClient();
} else {
    if (!global.prismaBase) {
        global.prismaBase = new PrismaClient();
    }
    prismaBase = global.prismaBase;
}

export { prismaBase };
