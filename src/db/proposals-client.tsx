/* eslint-disable no-var */

import { PrismaClient } from "@/../prisma/generated/client-proposals";

let prismaProposals: PrismaClient;

declare global {
    var prismaProposals: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    prismaProposals = new PrismaClient();
} else {
    if (!global.prismaProposals) {
        global.prismaProposals = new PrismaClient();
    }
    prismaProposals = global.prismaProposals;
}

export { prismaProposals };
