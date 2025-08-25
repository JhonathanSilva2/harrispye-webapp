/* eslint-disable no-var */

import { PrismaClient } from "@/../prisma/generated/client-proposals";
import { clientProposalsOptions } from "./client-options";

let prismaProposals: PrismaClient;

declare global {
    var prismaProposals: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    prismaProposals = new PrismaClient(clientProposalsOptions);
} else {
    if (!global.prismaProposals) {
        global.prismaProposals = new PrismaClient(clientProposalsOptions);
    }
    prismaProposals = global.prismaProposals;
}

export { prismaProposals };
