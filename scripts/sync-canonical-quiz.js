import { extractQuiz, writeJson } from "./quiz-source.js";

const sources = [
  ["cn/index.html", "data/quiz.zh.json"],
  ["en/index.html", "data/quiz.en.json"]
];

for (const [source, target] of sources) {
  const data = extractQuiz(source);
  writeJson(target, data);
  console.log(`Wrote ${target} from ${source}.`);
}
