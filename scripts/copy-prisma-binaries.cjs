// scripts/copy-prisma-binaries.cjs
const { copyFileSync, mkdirSync, existsSync, readdirSync } = require("fs");
const { join, basename } = require("path");

// packages to inspect
const pkgs = [".prisma/client"];

console.log("🔍 CWD:", process.cwd());

const outDir = join(process.cwd(), ".next/standalone/.next/server/chunks");
console.log("→ Ensuring outDir:", outDir);
mkdirSync(outDir, { recursive: true });

for (const pkg of pkgs) {
    const pkgDir = join(process.cwd(), "node_modules", pkg);
    console.log(`\n📦 Inspecting ${pkgDir}`);

    if (!existsSync(pkgDir)) {
        console.warn(`  ⚠️  Package folder missing: ${pkgDir}`);
        continue;
    }

    // list all .so.node files in the package folder
    const engines = readdirSync(pkgDir).filter((f) => f.endsWith(".so.node"));
    console.log("  Found engines:", engines);

    if (engines.length === 0) {
        console.warn(`  ⚠️  No .so.node files to copy in ${pkgDir}`);
        continue;
    }

    for (const file of engines) {
        const src = join(pkgDir, file);
        const dst = join(outDir, basename(file));
        copyFileSync(src, dst);
        console.log(`  ✔️  Copied ${src} → ${dst}`);

        // copy to @prisma/client as well
        const clientDst = join(
            process.cwd(),
            "node_modules",
            "@prisma",
            "client",
            basename(file),
        );
        copyFileSync(src, clientDst);
        console.log(`  ✔️  Copied ${src} → ${clientDst}`);
    }
}
