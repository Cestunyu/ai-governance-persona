import { randomUUID, timingSafeEqual } from "node:crypto";

export const MAX_BODY_BYTES = 64 * 1024;
export const VALID_QUIZ_ID = "ai-ideology-quiz";
export const VALID_LOCALES = new Set(["zh-CN", "en"]);
export const RESULT_SCHEMA_VERSION = "2026-06-10";

const REQUIRED_OBJECT_FIELDS = [
  "answers",
  "scenarios",
  "scores",
  "labels",
  "projection",
  "diagnostics"
];

const ALLOWED_PAYLOAD_FIELDS = new Set([
  "quiz_id",
  "quiz_version",
  "measurement_version",
  "locale",
  "started_at",
  "completed_at",
  "duration_ms",
  "profile_code",
  "profile_display_code",
  "profile_name",
  "profile_lineage",
  "profile_confidence",
  "profile_margin",
  "profile_distance",
  "projection",
  "respondent_vector",
  "item_signal_vector",
  "profile_ranking",
  "scores",
  "labels",
  "answers",
  "answer_keys",
  "scenarios",
  "scenario_keys",
  "closest_statement",
  "closest_statement_keys",
  "diagnostics",
  "summary",
  "turnstile_token"
]);

const STRIPPED_PAYLOAD_FIELDS = [
  "name",
  "email",
  "ip",
  "ip_address",
  "raw_ip",
  "free_text",
  "identity",
  "referrer"
];

export const csvFields = [
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

export function jsonHeaders() {
  return {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}

export function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function assertPlainObject(value, fieldName) {
  if (!isPlainObject(value)) throw new Error(`${fieldName} must be an object.`);
}

export function assertString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string.`);
  }
}

export function assertFiniteOrEmpty(value, fieldName) {
  if (value === "" || value === undefined || value === null) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number or empty string.`);
  }
}

export function assertPayload(payload) {
  if (!isPlainObject(payload)) throw new Error("Payload must be a JSON object.");
  if (payload.quiz_id !== VALID_QUIZ_ID) throw new Error("Unknown quiz_id.");
  assertString(payload.quiz_version, "quiz_version");
  assertString(payload.measurement_version, "measurement_version");
  assertString(payload.locale, "locale");
  if (!VALID_LOCALES.has(payload.locale)) throw new Error("Unknown locale.");
  if (payload.started_at !== undefined) assertString(payload.started_at, "started_at");
  assertString(payload.completed_at, "completed_at");
  assertFiniteOrEmpty(payload.duration_ms, "duration_ms");
  assertString(payload.profile_code, "profile_code");
  for (const fieldName of REQUIRED_OBJECT_FIELDS) assertPlainObject(payload[fieldName], fieldName);
  assertPlainObject(payload.respondent_vector, "respondent_vector");
  if (!Array.isArray(payload.profile_ranking)) throw new Error("profile_ranking must be an array.");
  if (!Array.isArray(payload.closest_statement)) throw new Error("closest_statement must be an array.");
  if (payload.answer_keys !== undefined) assertPlainObject(payload.answer_keys, "answer_keys");
  if (payload.scenario_keys !== undefined) assertPlainObject(payload.scenario_keys, "scenario_keys");
  if (payload.closest_statement_keys !== undefined && !Array.isArray(payload.closest_statement_keys)) {
    throw new Error("closest_statement_keys must be an array.");
  }

  assertFiniteOrEmpty(payload.scores.x, "scores.x");
  assertFiniteOrEmpty(payload.scores.y, "scores.y");
  assertFiniteOrEmpty(payload.scores.c, "scores.c");
  assertFiniteOrEmpty(payload.scores.h, "scores.h");
  assertFiniteOrEmpty(payload.profile_margin, "profile_margin");
  assertFiniteOrEmpty(payload.profile_distance, "profile_distance");

  const coreAnswerIds = ["U01", "H02", "C04", "C02", "C03", "L01", "I01", "T01", "D01", "R01", "R04", "E01", "H01", "H04"];
  const missingCoreAnswers = coreAnswerIds.filter((id) => !payload.answers[id]);
  if (missingCoreAnswers.length) throw new Error(`Missing core answers: ${missingCoreAnswers.join(", ")}.`);
  if (!payload.scenarios.V3) throw new Error("Missing scenario answer: V3.");
}

export async function readJsonBody(req) {
  const declaredLength = Number(headerValue(req.headers, "content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new Error("Request body is too large.");

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("Request body is too large.");
    chunks.push(buffer);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function sanitizePayload(payload) {
  const clean = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_PAYLOAD_FIELDS.has(key) || STRIPPED_PAYLOAD_FIELDS.includes(key)) continue;
    if (key === "turnstile_token") continue;
    clean[key] = value;
  }
  return clean;
}

export function resultId() {
  return randomUUID();
}

export function buildResultRecord(payload, options = {}) {
  const clean = sanitizePayload(payload);
  const createdAt = new Date().toISOString();
  return {
    id: resultId(),
    created_at: createdAt,
    source: options.source || "vercel",
    schema_version: RESULT_SCHEMA_VERSION,
    quiz_id: clean.quiz_id,
    quiz_version: clean.quiz_version,
    measurement_version: clean.measurement_version,
    locale: clean.locale,
    profile_code: clean.profile_code,
    anti_abuse: {
      body_size_limit_bytes: MAX_BODY_BYTES,
      strict_schema: true,
      turnstile_enforced: Boolean(options.turnstileEnforced)
    },
    payload: clean
  };
}

export function shouldRequireTurnstile(env = process.env) {
  return String(env.REQUIRE_TURNSTILE || "").toLowerCase() === "true";
}

export function headerValue(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) || "";
  return headers[name.toLowerCase()] || headers[name] || "";
}

export async function verifyTurnstile(req, payload, env = process.env) {
  if (!shouldRequireTurnstile(env)) return { ok: true, enforced: false };
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false, status: 500, error: "Turnstile is required but TURNSTILE_SECRET_KEY is not configured." };
  }

  const token =
    payload.turnstile_token ||
    headerValue(req.headers, "cf-turnstile-response") ||
    headerValue(req.headers, "x-turnstile-token") ||
    "";
  if (!token) return { ok: false, status: 403, error: "Missing Turnstile token." };

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData
  });
  const result = await response.json().catch(() => ({}));
  if (!result.success) return { ok: false, status: 403, error: "Turnstile verification failed." };
  return { ok: true, enforced: true };
}

export function supabaseConfig(env = process.env) {
  const url = String(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || env.SUPABASE_SECRET_KEY || "";
  const table = env.SUPABASE_RESULTS_TABLE || "quiz_results";
  const missing = [];
  if (!url) missing.push("SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) return { ok: false, configured: false, missing };
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(table)) {
    return { ok: false, configured: true, error: "SUPABASE_RESULTS_TABLE must be a plain table name." };
  }
  return { ok: true, configured: true, url, key, table };
}

export async function insertSupabaseRecord(record, env = process.env) {
  const config = supabaseConfig(env);
  if (!config.ok) return config;

  const response = await fetch(`${config.url}/rest/v1/${config.table}`, {
    method: "POST",
    headers: supabaseHeaders(config.key, { Prefer: "return=representation" }),
    body: JSON.stringify(record)
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      status: response.status,
      error: `Supabase insert failed (${response.status}): ${text.slice(0, 300)}`
    };
  }
  return { ok: true, configured: true, data: parseJson(text) };
}

export async function listSupabaseRecords(env = process.env) {
  const config = supabaseConfig(env);
  if (!config.ok) return config;

  const limit = Number(env.SUPABASE_EXPORT_LIMIT || 10000);
  const params = new URLSearchParams({
    select: "*",
    order: "created_at.asc",
    limit: String(Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50000) : 10000)
  });
  const response = await fetch(`${config.url}/rest/v1/${config.table}?${params.toString()}`, {
    headers: supabaseHeaders(config.key)
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      status: response.status,
      error: `Supabase export failed (${response.status}): ${text.slice(0, 300)}`
    };
  }
  return { ok: true, configured: true, records: parseJson(text) || [] };
}

export async function checkSupabaseRead(env = process.env) {
  const config = supabaseConfig(env);
  if (!config.ok) return config;

  const params = new URLSearchParams({
    select: "id,created_at",
    limit: "1"
  });
  const response = await fetch(`${config.url}/rest/v1/${config.table}?${params.toString()}`, {
    headers: supabaseHeaders(config.key)
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      status: response.status,
      table: config.table,
      error: `Supabase read check failed (${response.status}): ${text.slice(0, 300)}`
    };
  }
  const rows = parseJson(text);
  return {
    ok: true,
    configured: true,
    table: config.table,
    sample_count: Array.isArray(rows) ? rows.length : 0
  };
}

export function isAuthorized(req, env = process.env) {
  const configuredToken = env.EXPORT_TOKEN || env.RESULTS_EXPORT_TOKEN;
  if (!configuredToken) {
    return { ok: false, status: 500, message: "EXPORT_TOKEN is not configured." };
  }

  const url = new URL(req.url || "/", `https://${headerValue(req.headers, "host") || "localhost"}`);
  const queryToken = url.searchParams.get("token");
  const authHeader = headerValue(req.headers, "authorization");
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const providedToken = queryToken || bearerToken;

  if (!providedToken || !secureEqual(providedToken, configuredToken)) {
    return { ok: false, status: 401, message: "Unauthorized." };
  }

  return { ok: true };
}

export function recordsToCsv(records) {
  const rows = recordsToRows(records);
  return [
    csvFields.map(csvCell).join(","),
    ...rows.map((row) => csvFields.map((field) => csvCell(row[field])).join(","))
  ].join("\n");
}

export function recordsToRows(records) {
  return records
    .filter(Boolean)
    .sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")))
    .map(flattenRecord);
}

function supabaseHeaders(key, extra = {}) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...extra
  };
}

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function secureEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length || !left.length) return false;
  return timingSafeEqual(left, right);
}

function csvCell(value) {
  if (value === undefined || value === null) return "";
  const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

function safeJSON(value) {
  return value && typeof value === "object" ? JSON.stringify(value) : "";
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null) ?? "";
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
    duration_ms: firstDefined(payload.duration_ms),
    id: record?.id || "",
    quiz_version: payload.quiz_version || "",
    measurement_version: payload.measurement_version || "",
    locale: payload.locale || "",
    profile_code: payload.profile_code || "",
    profile_name: payload.profile_name || "",
    profile_lineage: payload.profile_lineage || "",
    profile_confidence: firstDefined(payload.profile_confidence, diagnostics.classification_confidence),
    profile_margin: firstDefined(payload.profile_margin, diagnostics.profile_margin),
    profile_distance: firstDefined(payload.profile_distance, diagnostics.profile_distance),
    projection_method: projection.method || "",
    x: firstDefined(scores.x),
    y: firstDefined(scores.y),
    r_projection: firstDefined(scores.r_projection),
    r_catastrophic: firstDefined(scores.r_catastrophic),
    r_social_harm: firstDefined(scores.r_social_harm),
    r_normal_tech: firstDefined(scores.r_normal_tech),
    r_opportunity_cost: firstDefined(scores.r_opportunity_cost),
    c: firstDefined(scores.c),
    h: firstDefined(scores.h),
    ability_score: firstDefined(scores.ability),
    ability_label: labels.ability || "",
    risk_label: labels.risk || "",
    governance_label: labels.governance || labels.response || "",
    value_label: labels.value || "",
    quadrant: labels.quadrant || "",
    warmup_reaction: payload.warmup_reaction || "",
    closest_statement: closestStatement,
    closest_statement_keys: closestStatementKeys,
    scenario_v3: firstDefined(scenarios.V3),
    scenario_v3_key: scenarioKeys.V3 || "",
    U01: firstDefined(answers.U01),
    H02: firstDefined(answers.H02),
    C04: firstDefined(answers.C04),
    C02: firstDefined(answers.C02),
    C03: firstDefined(answers.C03),
    L01: firstDefined(answers.L01),
    I01: firstDefined(answers.I01),
    T01: firstDefined(answers.T01),
    D01: firstDefined(answers.D01),
    R01: firstDefined(answers.R01),
    R04: firstDefined(answers.R04),
    E01: firstDefined(answers.E01),
    H01: firstDefined(answers.H01),
    H04: firstDefined(answers.H04),
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
    self_agreement: firstDefined(diagnostics.self_agreement),
    scenario_agreement: firstDefined(diagnostics.scenario_agreement),
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
