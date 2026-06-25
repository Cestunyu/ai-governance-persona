import {
  checkSupabaseRead,
  isAuthorized
} from "../lib/result-storage.js";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  const authorization = isAuthorized(req);
  if (!authorization.ok) {
    sendJson(res, authorization.status, { ok: false, error: authorization.message });
    return;
  }

  const result = await checkSupabaseRead();
  if (!result.ok && !result.configured) {
    sendJson(res, 501, {
      ok: false,
      configured: false,
      error: "Supabase result storage is not configured.",
      missing_env: result.missing
    });
    return;
  }

  if (!result.ok) {
    sendJson(res, result.status || 502, {
      ok: false,
      configured: true,
      table: result.table,
      error: result.error || "Supabase read check failed."
    });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    configured: true,
    table: result.table,
    sample_count: result.sample_count
  });
}
