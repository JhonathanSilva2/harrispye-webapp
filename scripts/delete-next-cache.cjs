// delete-next-cache.cjs
const { rmSync } = require("fs");
const { join } = require("path");

const cacheDir = join(process.cwd(), ".next", "cache");
try {
    rmSync(cacheDir, { recursive: true, force: true });
    console.log("✅ .next/cache deleted");
} catch (err) {
    console.error("⚠️ Failed to delete .next/cache:", err);
}
