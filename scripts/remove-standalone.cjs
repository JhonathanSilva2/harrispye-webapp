const { rmSync, existsSync } = require("fs");
const { join } = require("path");

const path = join(process.cwd(), ".next", "standalone");
if (existsSync(path)) {
  try {
    rmSync(path, { recursive: true, force: true });
    console.log(`✔ Removed ${path}`);
  } catch (err) {
    console.error(`✖ Failed to remove ${path}:`, err);
    process.exitCode = 1;
  }
} else {
  console.log(`ℹ No standalone folder at ${path}`);
}
