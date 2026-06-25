import {
  assertPayload,
  buildResultRecord,
  insertSupabaseRecord,
  jsonHeaders,
  readJsonBody,
  verifyTurnstile
} from "../lib/result-storage.js";

function sendJson(res, status, body) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(jsonHeaders())) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    for (const [key, value] of Object.entries(jsonHeaders())) res.setHeader(key, value);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    assertPayload(payload);

    const botCheck = await verifyTurnstile(req, payload);
    if (!botCheck.ok) {
      sendJson(res, botCheck.status || 403, { ok: false, error: botCheck.error });
      return;
    }

    const record = buildResultRecord(payload, {
      source: "vercel",
      turnstileEnforced: botCheck.enforced
    });
    const storage = await insertSupabaseRecord(record);

    if (storage.ok) {
      sendJson(res, 200, {
        ok: true,
        stored: true,
        backend: "supabase",
        id: record.id,
        created_at: record.created_at
      });
      return;
    }

    if (!storage.configured) {
      sendJson(res, 200, {
        ok: true,
        stored: false,
        backend: "vercel-dynamic-unconfigured-storage",
        id: record.id,
        created_at: record.created_at,
        message: "Result payload accepted. Persistent storage is not configured yet.",
        missing_env: storage.missing
      });
      return;
    }

    sendJson(res, storage.status || 502, {
      ok: false,
      stored: false,
      backend: "supabase",
      error: storage.error || "Supabase storage failed."
    });
  } catch (error) {
    const message = error?.message || "Invalid result payload.";
    sendJson(res, message.includes("too large") ? 413 : 400, { ok: false, error: message });
  }
}
