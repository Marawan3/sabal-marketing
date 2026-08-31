import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const forbidden = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "NMI_SECURITY_KEY",
  "NMI_PRIVATE_KEY",
];

const files = [".env.local", ".env", ".env.production"];
let failed = false;

for (const file of files) {
  const full = join(process.cwd(), file);
  if (!existsSync(full)) continue;
  const text = readFileSync(full, "utf8");
  for (const key of forbidden) {
    if (new RegExp(`^${key}=`, "m").test(text)) {
      console.error(`Boundary: ${file} must not contain ${key}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("boundary-check: marketing app has no ROS secrets in env files");
