import { getStore } from "@edgeone/pages-blob";

const STORE_NAME = "ai-ideology-results";
const RESULT_PREFIX = "results";
const MAX_BODY_BYTES = 64 * 1024;
const VALID_QUIZ_ID = "ai-ideology-quiz";
const VALID_LOCALES = new Set(["zh-CN", "en"]);
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
  "completed_at",
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
  "scenarios",
  "closest_statement",
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

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}

function resultId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertPlainObject(value, fieldName) {
  if (!isPlainObject(value)) throw new Error(`${fieldName} must be an object.`);
}

function assertString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string.`);
  }
}

function assertFiniteOrEmpty(value, fieldName) {
  if (value === "" || value === undefined || value === null) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number or empty string.`);
  }
}

function assertPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Payload must be a JSON object.");
  }

  if (payload.quiz_id !== VALID_QUIZ_ID) {
    throw new Error("Unknown quiz_id.");
  }

  assertString(payload.quiz_version, "quiz_version");
  assertString(payload.measurement_version, "measurement_version");
  assertString(payload.locale, "locale");
  if (!VALID_LOCALES.has(payload.locale)) throw new Error("Unknown locale.");
  assertString(payload.completed_at, "completed_at");
  assertString(payload.profile_code, "profile_code");

  for (const fieldName of REQUIRED_OBJECT_FIELDS) {
    assertPlainObject(payload[fieldName], fieldName);
  }

  assertPlainObject(payload.respondent_vector, "respondent_vector");
  if (!Array.isArray(payload.profile_ranking)) {
    throw new Error("profile_ranking must be an array.");
  }
  if (!Array.isArray(payload.closest_statement)) {
    throw new Error("closest_statement must be an array.");
  }

  assertFiniteOrEmpty(payload.scores.x, "scores.x");
  assertFiniteOrEmpty(payload.scores.y, "scores.y");
  assertFiniteOrEmpty(payload.scores.c, "scores.c");
  assertFiniteOrEmpty(payload.scores.h, "scores.h");
  assertFiniteOrEmpty(payload.profile_margin, "profile_margin");
  assertFiniteOrEmpty(payload.profile_distance, "profile_distance");

  const coreAnswerIds = ["U01", "H02", "C04", "C02", "C03", "L01", "I01", "T01", "D01", "R01", "R04", "E01", "H01", "H04"];
  const missingCoreAnswers = coreAnswerIds.filter((id) => !payload.answers[id]);
  if (missingCoreAnswers.length) {
    throw new Error(`Missing core answers: ${missingCoreAnswers.join(", ")}.`);
  }

  const scenarioIds = ["V3"];
  const missingScenarios = scenarioIds.filter((id) => !payload.scenarios[id]);
  if (missingScenarios.length) {
    throw new Error(`Missing scenario answers: ${missingScenarios.join(", ")}.`);
  }
}

function sanitizePayload(payload) {
  const clean = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_PAYLOAD_FIELDS.has(key) || STRIPPED_PAYLOAD_FIELDS.includes(key)) continue;
    if (key === "turnstile_token") continue;
    clean[key] = value;
  }
  return clean;
}

function shouldRequireTurnstile(env = {}) {
  return String(env.REQUIRE_TURNSTILE || "").toLowerCase() === "true";
}

function turnstileTokenFrom(request, payload) {
  return (
    payload.turnstile_token ||
    request.headers.get("cf-turnstile-response") ||
    request.headers.get("x-turnstile-token") ||
    ""
  );
}

async function verifyTurnstile(request, payload, env = {}) {
  if (!shouldRequireTurnstile(env)) return { ok: true, enforced: false };
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false, status: 500, error: "Turnstile is required but TURNSTILE_SECRET_KEY is not configured." };
  }

  const token = turnstileTokenFrom(request, payload);
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

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: jsonHeaders
  });
}

async function handlePost({ request, env }) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: "Request body is too large." }, 413);
  }

  let payload;
  try {
    const raw = await request.text();
    const actualLength = new TextEncoder().encode(raw).length;
    if (actualLength > MAX_BODY_BYTES) {
      return jsonResponse({ ok: false, error: "Request body is too large." }, 413);
    }
    payload = JSON.parse(raw);
    assertPayload(payload);
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || "Invalid JSON payload." }, 400);
  }

  const botCheck = await verifyTurnstile(request, payload, env);
  if (!botCheck.ok) {
    return jsonResponse({ ok: false, error: botCheck.error }, botCheck.status);
  }

  const id = resultId();
  const createdAt = new Date().toISOString();
  const date = createdAt.slice(0, 10);
  const keySafeTime = createdAt.replace(/[-:.TZ]/g, "");
  const record = {
    id,
    created_at: createdAt,
    source: "edgeone-pages",
    schema_version: "2026-06-10",
    anti_abuse: {
      body_size_limit_bytes: MAX_BODY_BYTES,
      strict_schema: true,
      turnstile_enforced: botCheck.enforced
    },
    payload: sanitizePayload(payload)
  };

  const store = getStore(STORE_NAME);
  await store.setJSON(`${RESULT_PREFIX}/${date}/${keySafeTime}-${id}.json`, record, {
    onlyIfNew: true
  });

  return jsonResponse({ ok: true, id, created_at: createdAt });
}

function methodNotAllowed() {
  return jsonResponse({ ok: false, error: "Method not allowed." }, 405);
}

export function onRequestOptions(context) {
  return handleOptions(context);
}

export function onRequestPost(context) {
  return handlePost(context);
}

export default function onRequest(context) {
  if (context.request.method === "OPTIONS") return handleOptions(context);
  if (context.request.method === "POST") return handlePost(context);
  return methodNotAllowed();
}
