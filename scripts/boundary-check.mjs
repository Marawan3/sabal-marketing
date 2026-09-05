import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const forbidden = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "BLOB_READ_WRITE_TOKEN",
  "NMI_SECURITY_KEY",
  "NMI_PRIVATE_KEY",
  "RESEND_API_KEY",
];

const files = [".env.local", ".env", ".env.production", ".env.example"];
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

const pkg = readFileSync(join(process.cwd(), "package.json"), "utf8");
for (const name of ["resend", "@clerk/nextjs", "prisma", "drizzle-orm"]) {
  if (pkg.includes(`"${name}"`)) {
    console.error(`Boundary: package.json must not depend on ${name}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("boundary-check: marketing app has no product-repo secrets or DB clients");
