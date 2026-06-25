import { extractQuiz, writeJson } from "./quiz-source.js";

if (!process.argv.includes("--allow-html-source")) {
  console.error("This project is data-first: edit data/quiz.*.json, then run npm run quiz:sync-html.");
  console.error("To intentionally recover canonical JSON from production HTML, rerun with --allow-html-source.");
  process.exit(2);
}

const sources = [
  ["cn/index.html", "data/quiz.zh.json"],
  ["en/index.html", "data/quiz.en.json"]
];

for (const [source, target] of sources) {
  const data = extractQuiz(source);
  writeJson(target, data);
  console.log(`Wrote ${target} from ${source}.`);
}
