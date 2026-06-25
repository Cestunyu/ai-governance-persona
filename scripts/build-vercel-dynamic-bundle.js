import fs from "node:fs";
import path from "node:path";
import { extractQuiz, questionSummary, readJson, stable } from "./quiz-source.js";

const target = process.argv[2] || "/tmp/ai-persona-vercel-dynamic-dist";
const publicEntries = [
  "index.html",
  "admin",
  "ch",
  "cn",
  "en",
  "assets",
  "data",
  "api",
  "lib",
  "vercel.json",
  "ai-governance-spectrum.html",
  "ai-governance-spectrum-en.html",
  "ai-personality-profiles.html",
  "ai-governance-persona-profiles-en.html"
];

function assertCanonicalMatches() {
  const checks = [
    ["data/quiz.zh.json", "cn/index.html"],
    ["data/quiz.en.json", "en/index.html"]
  ];
  for (const [canonicalFile, htmlFile] of checks) {
    const canonical = readJson(canonicalFile);
    const html = extractQuiz(htmlFile);
    if (stable(canonical) !== stable(html)) {
      throw new Error(`${htmlFile} differs from ${canonicalFile}; run npm run quiz:check for details.`);
    }
  }
}

function copyEntry(entry) {
  fs.cpSync(entry, path.join(target, entry), { recursive: true, force: true });
}

assertCanonicalMatches();
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
for (const entry of publicEntries) copyEntry(entry);
fs.writeFileSync(
  path.join(target, "package.json"),
  `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`
);

for (const forbidden of [
  ".env",
  ".env.local",
  ".git",
  ".github",
  ".edgeone",
  "edge-functions",
  "edgeone.json",
  "site.css",
  "blog",
  "projects",
  "posts",
  "node_modules",
  "README.md",
  "CURRENT.md",
  "STATE.json",
  "TODO.json",
  "planning",
  "tasks",
  "questionnaires",
  "archive"
]) {
  if (fs.existsSync(path.join(target, forbidden))) {
    throw new Error(`Vercel bundle unexpectedly contains ${forbidden}`);
  }
}

console.log(`Vercel dynamic bundle written to ${target}`);
console.log("Included entries:");
for (const entry of publicEntries) console.log(`- ${entry}`);
console.log("\nQuestion summary:");
for (const line of questionSummary(readJson("data/quiz.zh.json"))) console.log(`- zh ${line}`);
for (const line of questionSummary(readJson("data/quiz.en.json"))) console.log(`- en ${line}`);
