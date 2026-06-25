import fs from "node:fs";
import { extractQuiz, questionSummary, readJson, stable } from "./quiz-source.js";

const checks = [
  { name: "zh", canonical: "data/quiz.zh.json", html: "cn/index.html" },
  { name: "en", canonical: "data/quiz.en.json", html: "en/index.html" }
];

function assertRedirect(file, target) {
  const source = fs.readFileSync(file, "utf8");
  if (!source.includes(`window.location.replace("${target}")`) && !source.includes(`url=${target}`)) {
    throw new Error(`${file} must redirect to ${target}`);
  }
}

const failures = [];
for (const check of checks) {
  const canonical = readJson(check.canonical);
  const html = extractQuiz(check.html);
  if (stable(canonical) !== stable(html)) {
    failures.push(`${check.html} differs from canonical ${check.canonical}`);
  }
}

try {
  assertRedirect("ch/index.html", "/cn/");
} catch (error) {
  failures.push(error.message);
}

if (failures.length) {
  console.error("Quiz release check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error("\nIf the HTML is intentionally newer, run: npm run quiz:canonicalize");
  process.exit(1);
}

console.log("Quiz release check passed.");
for (const check of checks) {
  console.log(`\n${check.name.toUpperCase()} canonical question summary`);
  for (const line of questionSummary(readJson(check.canonical))) console.log(`- ${line}`);
}
