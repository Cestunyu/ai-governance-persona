import { getStore } from "@edgeone/pages-blob";

const STORE_NAME = "ai-ideology-results";
const RESULT_PREFIX = "results/";

const csvFields = [
  "created_at",
  "started_at",
  "completed_at",
  "duration_ms",
  "id",
  "quiz_version",
  "measurement_version",
  "locale",
  "profile_code",
  "profile_name",
  "profile_lineage",
  "profile_confidence",
  "profile_margin",
  "profile_distance",
  "projection_method",
  "x",
  "y",
  "r_projection",
  "r_catastrophic",
  "r_social_harm",
  "r_normal_tech",
  "r_opportunity_cost",
  "c",
  "h",
  "ability_score",
  "ability_label",
  "risk_label",
  "governance_label",
  "value_label",
  "quadrant",
  "warmup_reaction",
  "closest_statement",
  "closest_statement_keys",
  "scenario_v3",
  "scenario_v3_key",
  "U01",
  "H02",
  "C04",
  "C02",
  "C03",
  "L01",
  "I01",
  "T01",
  "D01",
  "R01",
  "R04",
  "E01",
  "H01",
  "H04",
  "U01_key",
  "H02_key",
  "C04_key",
  "C02_key",
  "C03_key",
  "L01_key",
  "I01_key",
  "T01_key",
  "D01_key",
  "R01_key",
  "R04_key",
  "E01_key",
  "H01_key",
  "H04_key",
  "self_agreement",
  "scenario_agreement",
  "respondent_vector_json",
  "item_signal_vector_json",
  "profile_ranking_json",
  "projection_json",
  "answers_json",
  "answer_keys_json",
  "scenarios_json",
  "scenario_keys_json",
  "summary"
];

function textResponse(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers
  });
}

function secureEqual(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    diff |= left.charCodeAt(index % left.length || 0) ^ right.charCodeAt(index % right.length || 0);
  }
  return diff === 0;
}

function isAuthorized(request, env = {}) {
  const configuredToken = env.EXPORT_TOKEN || env.RESULTS_EXPORT_TOKEN;
  if (!configuredToken) {
    return { ok: false, status: 500, message: "EXPORT_TOKEN is not configured." };
  }

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const providedToken = queryToken || bearerToken;

  if (!providedToken || !secureEqual(providedToken, configuredToken)) {
    return { ok: false, status: 401, message: "Unauthorized." };
  }

  return { ok: true };
}

function csvCell(value) {
  if (value === undefined || value === null) return "";
  const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

function safeJSON(value) {
  return value && typeof value === "object" ? JSON.stringify(value) : "";
}

function flattenRecord(record) {
  const payload = record?.payload || {};
  const scores = payload.scores || {};
  const labels = payload.labels || {};
  const answers = payload.answers || {};
  const answerKeys = payload.answer_keys || {};
  const scenarios = payload.scenarios || {};
  const scenarioKeys = payload.scenario_keys || {};
  const diagnostics = payload.diagnostics || {};
  const projection = payload.projection || {};
  const closestStatement = Array.isArray(payload.closest_statement)
    ? payload.closest_statement.join(" | ")
    : payload.closest_statement || "";
  const closestStatementKeys = Array.isArray(payload.closest_statement_keys)
    ? payload.closest_statement_keys.join(" | ")
    : payload.closest_statement_keys || "";

  return {
    created_at: record?.created_at || payload.completed_at || "",
    started_at: payload.started_at || "",
    completed_at: payload.completed_at || "",
    duration_ms: payload.duration_ms ?? "",
    id: record?.id || "",
    quiz_version: payload.quiz_version || "",
    measurement_version: payload.measurement_version || "",
    locale: payload.locale || "",
    profile_code: payload.profile_code || "",
    profile_name: payload.profile_name || "",
    profile_lineage: payload.profile_lineage || "",
    profile_confidence: payload.profile_confidence || diagnostics.classification_confidence || "",
    profile_margin: payload.profile_margin || diagnostics.profile_margin || "",
    profile_distance: payload.profile_distance || diagnostics.profile_distance || "",
    projection_method: projection.method || "",
    x: scores.x,
    y: scores.y,
    r_projection: scores.r_projection,
    r_catastrophic: scores.r_catastrophic,
    r_social_harm: scores.r_social_harm,
    r_normal_tech: scores.r_normal_tech,
    r_opportunity_cost: scores.r_opportunity_cost,
    c: scores.c,
    h: scores.h,
    ability_score: scores.ability,
    ability_label: labels.ability || "",
    risk_label: labels.risk || "",
    governance_label: labels.governance || labels.response || "",
    value_label: labels.value || "",
    quadrant: labels.quadrant || "",
    warmup_reaction: payload.warmup_reaction || "",
    closest_statement: closestStatement,
    closest_statement_keys: closestStatementKeys,
    scenario_v3: scenarios.V3 || "",
    scenario_v3_key: scenarioKeys.V3 || "",
    U01: answers.U01 || "",
    H02: answers.H02 || "",
    C04: answers.C04 || "",
    C02: answers.C02 || "",
    C03: answers.C03 || "",
    L01: answers.L01 || "",
    I01: answers.I01 || "",
    T01: answers.T01 || "",
    D01: answers.D01 || "",
    R01: answers.R01 || "",
    R04: answers.R04 || "",
    E01: answers.E01 || "",
    H01: answers.H01 || "",
    H04: answers.H04 || "",
    U01_key: answerKeys.U01 || "",
    H02_key: answerKeys.H02 || "",
    C04_key: answerKeys.C04 || "",
    C02_key: answerKeys.C02 || "",
    C03_key: answerKeys.C03 || "",
    L01_key: answerKeys.L01 || "",
    I01_key: answerKeys.I01 || "",
    T01_key: answerKeys.T01 || "",
    D01_key: answerKeys.D01 || "",
    R01_key: answerKeys.R01 || "",
    R04_key: answerKeys.R04 || "",
    E01_key: answerKeys.E01 || "",
    H01_key: answerKeys.H01 || "",
    H04_key: answerKeys.H04 || "",
    self_agreement: diagnostics.self_agreement,
    scenario_agreement: diagnostics.scenario_agreement,
    respondent_vector_json: safeJSON(payload.respondent_vector),
    item_signal_vector_json: safeJSON(payload.item_signal_vector),
    profile_ranking_json: safeJSON(payload.profile_ranking),
    projection_json: safeJSON(projection),
    answers_json: safeJSON(answers),
    answer_keys_json: safeJSON(answerKeys),
    scenarios_json: safeJSON(scenarios),
    scenario_keys_json: safeJSON(scenarioKeys),
    summary: payload.summary || ""
  };
}

async function handleGet({ request, env }) {
  const authorization = isAuthorized(request, env);
  if (!authorization.ok) {
    return textResponse(authorization.message, authorization.status, {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": "Bearer"
    });
  }

  const store = getStore({ name: STORE_NAME, consistency: "strong" });
  const { blobs } = await store.list({
    prefix: RESULT_PREFIX,
    consistency: "strong"
  });

  const records = await Promise.all(
    blobs.map(async (blob) => store.get(blob.key, { type: "json", consistency: "strong" }).catch(() => null))
  );
  const rows = records
    .filter(Boolean)
    .sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")))
    .map(flattenRecord);

  const csv = [
    csvFields.map(csvCell).join(","),
    ...rows.map((row) => csvFields.map((field) => csvCell(row[field])).join(","))
  ].join("\n");

  return textResponse(`\ufeff${csv}\n`, 200, {
    "content-type": "text/csv; charset=utf-8",
    "content-disposition": "attachment; filename=\"ai-ideology-results.csv\"",
    "cache-control": "no-store"
  });
}

function methodNotAllowed() {
  return textResponse("Method not allowed.", 405, {
    "content-type": "text/plain; charset=utf-8"
  });
}

export function onRequestGet(context) {
  return handleGet(context);
}

export default function onRequest(context) {
  if (context.request.method === "GET") return handleGet(context);
  return methodNotAllowed();
}
