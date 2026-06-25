import {
  isAuthorized,
  listSupabaseRecords,
  recordsToCsv
} from "../lib/result-storage.js";

function textResponse(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(body);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    textResponse(res, 405, "Method not allowed.\n", {
      "content-type": "text/plain; charset=utf-8"
    });
    return;
  }

  const authorization = isAuthorized(req);
  if (!authorization.ok) {
    textResponse(res, authorization.status, `${authorization.message}\n`, {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": "Bearer"
    });
    return;
  }

  const result = await listSupabaseRecords();
  if (!result.ok && !result.configured) {
    textResponse(
      res,
      501,
      `Supabase result export is not configured. Missing environment variables: ${result.missing.join(", ")}.\n`,
      { "content-type": "text/plain; charset=utf-8" }
    );
    return;
  }

  if (!result.ok) {
    textResponse(res, result.status || 502, `${result.error || "Supabase export failed."}\n`, {
      "content-type": "text/plain; charset=utf-8"
    });
    return;
  }

  textResponse(res, 200, `\ufeff${recordsToCsv(result.records)}\n`, {
    "content-type": "text/csv; charset=utf-8",
    "content-disposition": "attachment; filename=\"ai-ideology-results.csv\"",
    "cache-control": "no-store"
  });
}
