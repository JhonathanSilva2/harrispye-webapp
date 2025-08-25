/* eslint-disable no-var */

import { PrismaClient } from "@/../prisma/generated/client-hp-base";
import { clientBaseOptions } from "./client-options";

let prismaBase: PrismaClient;

declare global {
    var prismaBase: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    prismaBase = new PrismaClient(clientBaseOptions);
} else {
    if (!global.prismaBase) {
        global.prismaBase = new PrismaClient(clientBaseOptions);
    }
    prismaBase = global.prismaBase;
}

export { prismaBase };
