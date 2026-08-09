/**
 * Warns when placeholder content is still in profile.ts.
 *
 * Runs before every build so you get a loud reminder in the Vercel deploy log
 * rather than discovering fabricated project links after a recruiter clicks one.
 * It only warns — it never fails the build.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "src", "content", "profile.ts");

let src;
try {
  src = readFileSync(file, "utf8");
} catch {
  process.exit(0); // Nothing to check.
}

const PLACEHOLDERS = [
  ["your-username", "GitHub / LinkedIn URLs still point at your-username"],
  ["your-domain.com", "seo.siteUrl is still your-domain.com (breaks sitemap + link previews)"],
  ["Acme Technologies", "Experience still lists the placeholder employer 'Acme Technologies'"],
  ["Ledgerly", "Project 'Ledgerly' is placeholder content"],
  ["Transit Pulse", "Project 'Transit Pulse' is placeholder content"],
  ["Rulekit", "Project 'Rulekit' is placeholder content"],
  ["Sift", "Project 'Sift' is placeholder content"],
];

const found = PLACEHOLDERS.filter(([needle]) => src.includes(needle)).map(([, msg]) => msg);
const todos = (src.match(/\/\/ TODO/g) ?? []).length;

if (!found.length && !todos) {
  console.log("\x1b[32m✓\x1b[0m profile.ts — no placeholder content found\n");
  process.exit(0);
}

const y = "\x1b[33m";
const d = "\x1b[2m";
const r = "\x1b[0m";

console.log("");
console.log(`${y}┌─────────────────────────────────────────────────────────────┐${r}`);
console.log(`${y}│  PLACEHOLDER CONTENT STILL PRESENT                          │${r}`);
console.log(`${y}└─────────────────────────────────────────────────────────────┘${r}`);
for (const msg of found) console.log(`  ${y}•${r} ${msg}`);
if (todos) console.log(`  ${y}•${r} ${todos} TODO marker${todos === 1 ? "" : "s"} left in profile.ts`);
console.log("");
console.log(`  ${d}Fine while you're building. Do not share or deploy the site${r}`);
console.log(`  ${d}publicly until these are real — a reviewer who clicks a dead${r}`);
console.log(`  ${d}project link is a hard fail.${r}`);
console.log(`  ${d}Fix in: src/content/profile.ts${r}`);
console.log("");
