import fs from "node:fs";
import {
  extractQuiz,
  findConstRange,
  questionSummary,
  quizFields,
  readJson,
  stable,
  validateQuiz
} from "./quiz-source.js";

const pairs = [
  { name: "zh", canonical: "data/quiz.zh.json", html: "cn/index.html" },
  { name: "en", canonical: "data/quiz.en.json", html: "en/index.html" }
];

function indentFor(source, index) {
  const lineStart = source.lastIndexOf("\n", index) + 1;
  const match = source.slice(lineStart, index).match(/^\s*/);
  return match ? match[0] : "";
}

function literal(value, indent) {
  return JSON.stringify(value, null, 2).replace(/\n/g, `\n${indent}`);
}

function replaceConst(source, name, value) {
  const range = findConstRange(source, name);
  const indent = indentFor(source, range.start);
  const replacement = literal(value, indent);
  return `${source.slice(0, range.valueStart)}${replacement}${source.slice(range.valueEnd)}`;
}

for (const pair of pairs) {
  const canonical = readJson(pair.canonical);
  validateQuiz(pair.canonical, canonical);
  const embedded = extractQuiz(pair.html);
  if (stable(canonical) === stable(embedded)) {
    console.log(`${pair.html} already matches ${pair.canonical}.`);
    continue;
  }

  let source = fs.readFileSync(pair.html, "utf8");
  for (const field of quizFields) {
    source = replaceConst(source, field, canonical[field]);
  }
  fs.writeFileSync(pair.html, source);
  console.log(`Synced ${pair.html} from ${pair.canonical}.`);
  console.log(`${pair.name.toUpperCase()} canonical question summary`);
  for (const line of questionSummary(canonical)) console.log(`- ${line}`);
}
