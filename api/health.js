import { supabaseConfig } from "../lib/result-storage.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed." }));
    return;
  }

  const storage = supabaseConfig();
  res.statusCode = 200;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify({
    ok: true,
    runtime: "vercel-function",
    dynamic: true,
    storage: {
      configured: Boolean(storage.configured && storage.ok),
      missing_env: storage.missing || [],
      error: storage.error || null
    },
    export: {
      configured: Boolean(process.env.EXPORT_TOKEN || process.env.RESULTS_EXPORT_TOKEN)
    },
    now: new Date().toISOString()
  }));
}
