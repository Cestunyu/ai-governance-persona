import { getStore } from "@edgeone/pages-blob";

const STORE_NAME = "ai-ideology-results";
const RESULT_PREFIX = "results/";

const csvFields = [
  "created_at",
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
  "scenario_v2",
  "scenario_v3",
  "scenario_v4",
  "R01",
  "R02",
  "R03",
  "R04",
  "D01",
  "C01",
  "C02",
  "C03",
  "C04",
  "H01",
  "H02",
  "H03",
  "H04",
  "self_agreement",
  "scenario_agreement",
  "respondent_vector_json",
  "item_signal_vector_json",
  "profile_ranking_json",
  "projection_json",
  "answers_json",
  "scenarios_json",
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
  const scenarios = payload.scenarios || {};
  const diagnostics = payload.diagnostics || {};
  const projection = payload.projection || {};
  const closestStatement = Array.isArray(payload.closest_statement)
    ? payload.closest_statement.join(" | ")
    : payload.closest_statement || "";

  return {
    created_at: record?.created_at || payload.completed_at || "",
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
    scenario_v2: scenarios.V2 || "",
    scenario_v3: scenarios.V3 || "",
    scenario_v4: scenarios.V4 || "",
    R01: answers.R01 || "",
    R02: answers.R02 || "",
    R03: answers.R03 || "",
    R04: answers.R04 || "",
    D01: answers.D01 || "",
    C01: answers.C01 || "",
    C02: answers.C02 || "",
    C03: answers.C03 || "",
    C04: answers.C04 || "",
    H01: answers.H01 || "",
    H02: answers.H02 || "",
    H03: answers.H03 || "",
    H04: answers.H04 || "",
    self_agreement: diagnostics.self_agreement,
    scenario_agreement: diagnostics.scenario_agreement,
    respondent_vector_json: safeJSON(payload.respondent_vector),
    item_signal_vector_json: safeJSON(payload.item_signal_vector),
    profile_ranking_json: safeJSON(payload.profile_ranking),
    projection_json: safeJSON(projection),
    answers_json: safeJSON(answers),
    scenarios_json: safeJSON(scenarios),
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
