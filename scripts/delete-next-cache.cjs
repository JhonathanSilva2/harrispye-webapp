// delete-next-cache.cjs
const { rmSync } = require("fs");
const { join } = require("path");

const nextDir = join(process.cwd(), ".next");
const cacheDir = join(process.cwd(), ".next", "cache");

function getFolderSize(dir) {
    let total = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const res = join(dir, entry.name);
        total += entry.isDirectory() ? getFolderSize(res) : statSync(res).size;
    }
    return total;
}

try {
    rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ .next/cache deleted");
} catch (err) {
    console.error("⚠️ Failed to delete .next/cache:", err);
}

try {
    const bytes = getFolderSize(nextDir);
    const mb = (bytes / 1024 / 1024).toFixed(2);
    console.log(`📦 .next folder size: ${mb} MB`);
} catch (err) {
    console.error("⚠️ Failed to calculate .next size:", err);
}
