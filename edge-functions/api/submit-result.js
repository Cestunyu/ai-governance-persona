import { getStore } from "@edgeone/pages-blob";

const STORE_NAME = "ai-ideology-results";
const RESULT_PREFIX = "results";
const MAX_BODY_BYTES = 64 * 1024;

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

function assertPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Payload must be a JSON object.");
  }

  if (payload.quiz_id && payload.quiz_id !== "ai-ideology-quiz") {
    throw new Error("Unknown quiz_id.");
  }

  if (payload.profile_code && typeof payload.profile_code !== "string") {
    throw new Error("profile_code must be a string.");
  }
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: jsonHeaders
  });
}

async function handlePost({ request }) {
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

  const id = resultId();
  const createdAt = new Date().toISOString();
  const date = createdAt.slice(0, 10);
  const keySafeTime = createdAt.replace(/[-:.TZ]/g, "");
  const record = {
    id,
    created_at: createdAt,
    source: "edgeone-pages",
    payload
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
