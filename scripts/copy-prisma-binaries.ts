#!/usr/bin/env ts-node

import { copyFileSync, existsSync, mkdirSync } from "fs";
import { basename, join } from "path";

type EngineConfig = {
    pkg: string; // the package under node_modules
    file: string; // the SO filename
};

const engines: EngineConfig[] = [
    {
        pkg: "@prisma/client-hp-base",
        file: "query_engine-debian-openssl-3.0.x.so.node",
    },
    {
        pkg: "@prisma/client-proposals",
        file: "query_engine-debian-openssl-3.0.x.so.node",
    },
];

const outDir = join(process.cwd(), ".next/standalone/server/chunks");
mkdirSync(outDir, { recursive: true });

for (const { pkg, file } of engines) {
    const src = join(process.cwd(), "node_modules", pkg, file);
    const dst = join(outDir, basename(file));
    if (!existsSync(src)) {
        console.warn(`⚠️  Missing engine at ${src}`);
        continue;
    }
    copyFileSync(src, dst);
    console.log(
        `✔️  Copied ${pkg}/${file} → .next/standalone/server/chunks/${file}`,
    );
}
