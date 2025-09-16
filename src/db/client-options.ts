import { Prisma } from "prisma/generated/client-hp-base";
import { Prisma as PrismaProposals } from "prisma/generated/client-proposals";

const log: Prisma.LogDefinition[] = [
    { level: "error", emit: "stdout" },
    { level: "warn", emit: "stdout" },
    { level: "query", emit: "event" },
];

export const clientBaseOptions: Prisma.Subset<
    Prisma.PrismaClientOptions,
    Prisma.PrismaClientOptions
> = {
    log,
};

export const clientProposalsOptions =
    clientBaseOptions as PrismaProposals.Subset<
        PrismaProposals.PrismaClientOptions,
        PrismaProposals.PrismaClientOptions
    >;
