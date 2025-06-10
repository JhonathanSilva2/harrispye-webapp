// scripts/copy-prisma-binaries.cjs
const { copyFileSync, mkdirSync, existsSync } = require("fs");
const { join, basename } = require("path");

const engines = [
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
    console.log(`✔️  Copied ${pkg}/${file} → server/chunks/${file}`);
}
