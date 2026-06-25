import {
  buildResultRecord,
  checkSupabaseRead,
  insertSupabaseRecord,
  supabaseConfig
} from "../lib/result-storage.js";

const readOnly = process.argv.includes("--read-only");

function log(message) {
  console.log(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function supabaseHeaders(key, extra = {}) {
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...extra
  };
}

function verificationPayload() {
  const coreIds = ["U01", "H02", "C04", "C02", "C03", "L01", "I01", "T01", "D01", "R01", "R04", "E01", "H01", "H04"];
  return {
    quiz_id: "ai-ideology-quiz",
    quiz_version: "supabase-ready-check",
    measurement_version: "supabase-ready-check",
    locale: "en",
    started_at: new Date(Date.now() - 1000).toISOString(),
    completed_at: new Date().toISOString(),
    duration_ms: 1000,
    profile_code: "supabase-ready-check",
    answers: Object.fromEntries(coreIds.map((id) => [id, { value: 3 }])),
    scenarios: { V3: { value: 3 } },
    scores: { x: 0, y: 0, c: 0, h: 0 },
    labels: {},
    projection: {},
    diagnostics: {},
    respondent_vector: {},
    profile_ranking: [],
    closest_statement: [],
    summary: "Temporary Supabase readiness check row."
  };
}

async function deleteRecord(config, id) {
  const params = new URLSearchParams({ id: `eq.${id}` });
  const response = await fetch(`${config.url}/rest/v1/${config.table}?${params.toString()}`, {
    method: "DELETE",
    headers: supabaseHeaders(config.key, { Prefer: "return=minimal" })
  });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: `Supabase cleanup failed (${response.status}): ${text.slice(0, 300)}`
    };
  }
  return { ok: true };
}

const config = supabaseConfig();
if (!config.ok) {
  if (!config.configured) {
    fail(`Supabase env is incomplete. Missing: ${config.missing.join(", ")}.`);
  }
  fail(config.error || "Supabase config is invalid.");
}

log(`Checking Supabase table ${config.table}...`);

const read = await checkSupabaseRead();
if (!read.ok) fail(read.error || "Supabase read check failed.");
log(`Read check passed. Sample rows returned: ${read.sample_count}.`);

if (readOnly) {
  log("Read-only mode enabled; write/delete check skipped.");
  process.exit(0);
}

const record = buildResultRecord(verificationPayload(), {
  source: "supabase-ready-check",
  turnstileEnforced: false
});

const insert = await insertSupabaseRecord(record);
if (!insert.ok) fail(insert.error || "Supabase insert check failed.");
log(`Write check passed. Temporary row id: ${record.id}.`);

const cleanup = await deleteRecord(config, record.id);
if (!cleanup.ok) fail(cleanup.error || `Temporary row ${record.id} could not be deleted.`);
log("Cleanup check passed. Temporary row deleted.");
log("Supabase readiness check passed.");
