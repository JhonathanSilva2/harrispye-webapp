#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const standaloneDir =
    process.argv[2] || path.join(process.cwd(), ".next/standalone");
const rootModules = path.join(process.cwd(), "node_modules");
const standaloneModules = path.join(standaloneDir, "node_modules");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

[".prisma", "@prisma"].forEach((pkgName) => {
    const src = path.join(rootModules, pkgName);
    const dest = path.join(standaloneModules, pkgName);

    if (fs.existsSync(dest)) {
        console.log(`✔ ${pkgName} already exists in standalone.`);
    } else {
        console.log(`⚠ ${pkgName} missing in standalone – copying…`);
        if (!fs.existsSync(src)) {
            console.error(
                `✖ Source not found at ${src}; skipping ${pkgName}.`,
            );
        } else {
            ensureDir(path.dirname(dest));
            fs.cpSync(src, dest, { recursive: true });
            console.log(`✔ Copied ${pkgName} to standalone.`);
        }
    }
});
