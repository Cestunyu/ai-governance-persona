import fs from "node:fs";
import vm from "node:vm";

export const quizFields = [
  "measurementVersion",
  "questions",
  "scenarios",
  "statements",
  "statementProfiles",
  "scenarioProfiles",
  "optionVectorRules",
  "coreQuestionOrder",
  "scenarioOrder"
];

export function stable(value) {
  return JSON.stringify(value, null, 2);
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, value) {
  fs.writeFileSync(file, `${stable(value)}\n`);
}

export function findConst(source, name) {
  const marker = `const ${name} =`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`missing ${name}`);
  let i = start + marker.length;
  while (/\s/.test(source[i])) i += 1;
  const first = source[i];
  if (first === "\"" || first === "'") {
    const quote = first;
    i += 1;
    let escaped = false;
    while (i < source.length) {
      const char = source[i];
      if (!escaped && char === quote) {
        i += 1;
        break;
      }
      escaped = !escaped && char === "\\";
      if (char !== "\\") escaped = false;
      i += 1;
    }
    return source.slice(start + marker.length, i).trim();
  }
  const closeFor = { "[": "]", "{": "}" };
  const stack = [closeFor[first]];
  if (!stack[0]) throw new Error(`unsupported initializer for ${name}`);
  i += 1;
  let quote = "";
  let escaped = false;
  while (i < source.length && stack.length) {
    const char = source[i];
    if (quote) {
      if (!escaped && char === quote) quote = "";
      escaped = !escaped && char === "\\";
      if (char !== "\\") escaped = false;
      i += 1;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") quote = char;
    else if (closeFor[char]) stack.push(closeFor[char]);
    else if (char === stack[stack.length - 1]) stack.pop();
    i += 1;
  }
  if (stack.length) throw new Error(`unclosed initializer for ${name}`);
  return source.slice(start + marker.length, i).trim();
}

export function readConst(source, name) {
  return vm.runInNewContext(`(${findConst(source, name)})`, {}, { timeout: 1000 });
}

export function extractQuiz(file) {
  const source = fs.readFileSync(file, "utf8");
  const data = Object.fromEntries(quizFields.map((field) => [field, readConst(source, field)]));
  validateQuiz(file, data);
  return data;
}

export function validateQuiz(file, data) {
  const questionIds = new Set(data.questions.map((question) => question.id));
  for (const id of data.coreQuestionOrder) {
    if (!questionIds.has(id)) throw new Error(`${file}: coreQuestionOrder references missing question ${id}`);
  }
  const scenarioIds = new Set(data.scenarios.map((scenario) => scenario.id));
  for (const id of data.scenarioOrder) {
    if (!scenarioIds.has(id)) throw new Error(`${file}: scenarioOrder references missing scenario ${id}`);
  }
  for (const question of data.questions) {
    const rules = data.optionVectorRules[question.id];
    if (!rules) continue;
    const optionValues = question.options.map((option) => option[0]).sort();
    const ruleValues = Object.keys(rules).sort();
    if (stable(optionValues) !== stable(ruleValues)) {
      throw new Error(`${file}: ${question.id} options ${optionValues.join(",")} do not match vector rules ${ruleValues.join(",")}`);
    }
  }
  if (data.statements.length !== data.statementProfiles.length) {
    throw new Error(`${file}: statements and statementProfiles length mismatch`);
  }
}

export function questionSummary(data) {
  return [
    `measurementVersion: ${data.measurementVersion}`,
    `coreQuestionOrder: ${data.coreQuestionOrder.join(", ")}`,
    ...data.coreQuestionOrder.map((id) => {
      const question = data.questions.find((item) => item.id === id);
      return `${id}: ${question ? question.text : "MISSING"}`;
    }),
    ...data.scenarioOrder.map((id) => {
      const scenario = data.scenarios.find((item) => item.id === id);
      return `${id}: ${scenario ? scenario.prompt : "MISSING"}`;
    })
  ];
}
