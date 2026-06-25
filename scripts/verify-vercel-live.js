import dns from "node:dns/promises";

const base = (process.argv.find((arg) => arg.startsWith("--base=")) || "--base=https://linenyu-site.vercel.app").slice("--base=".length).replace(/\/+$/, "");
const requireConfigured = process.argv.includes("--require-configured");
const submitCheck = process.argv.includes("--submit");
const exportToken = process.env.REMOTE_DATABASE_TOKEN || process.env.EXPORT_TOKEN || process.env.RESULTS_EXPORT_TOKEN || "";

const failures = [];
const notes = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function fetchText(path, expectedNeedle) {
  const response = await fetch(`${base}${path}`);
  const text = await response.text();
  assert(response.ok, `${path} returned ${response.status}.`);
  if (expectedNeedle) assert(text.includes(expectedNeedle), `${path} did not include ${JSON.stringify(expectedNeedle)}.`);
  return { response, text };
}

async function verifyPages() {
  await fetchText("/", "<title>Linen Yu</title>");
  await fetchText("/en/", "1 usage item plus 15 scored questions");
  await fetchText("/cn/", "1 道使用情况题 + 15 道计分题");
  await fetchText("/admin/", "AI Persona Results");

  const cv = await fetch(`${base}/assets/cv/linen-yu-cv.pdf`, { method: "HEAD" });
  assert(cv.ok, `/assets/cv/linen-yu-cv.pdf returned ${cv.status}.`);
}

async function verifyHealth() {
  const response = await fetch(`${base}/api/health`, { cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  assert(response.ok, `/api/health returned ${response.status}.`);
  assert(body.dynamic === true, "/api/health must report dynamic:true.");
  notes.push(`storage.configured=${Boolean(body.storage?.configured)}`);
  notes.push(`export.configured=${Boolean(body.export?.configured)}`);

  if (requireConfigured) {
    assert(body.storage?.configured === true, "Supabase storage must be configured.");
    assert(body.export?.configured === true, "EXPORT_TOKEN or RESULTS_EXPORT_TOKEN must be configured.");
  }

  return body;
}

async function verifyResultsProtection(health) {
  const response = await fetch(`${base}/api/results`, { cache: "no-store" });
  const text = await response.text();
  if (health.export?.configured) {
    assert(response.status === 401, `/api/results without a token should return 401 when export token is configured; got ${response.status}.`);
  } else {
    assert(response.status === 500, `/api/results should report missing EXPORT_TOKEN before export is configured; got ${response.status}: ${text}`);
  }
}

async function verifySubmitEndpoint(health) {
  if (!submitCheck && health.storage?.configured) {
    if (requireConfigured) {
      assert(false, "Use --submit with --require-configured so stored:true is verified with a real test row.");
      return;
    }
    notes.push("submit check skipped because it would write a test row; rerun with --submit to verify stored:true.");
    return;
  }

  const coreIds = ["U01", "H02", "C04", "C02", "C03", "L01", "I01", "T01", "D01", "R01", "R04", "E01", "H01", "H04"];
  const payload = {
    quiz_id: "ai-ideology-quiz",
    quiz_version: "live-verify",
    measurement_version: "live-verify",
    locale: "en",
    started_at: new Date(Date.now() - 1000).toISOString(),
    completed_at: new Date().toISOString(),
    duration_ms: 1000,
    profile_code: "live-verify",
    answers: Object.fromEntries(coreIds.map((id) => [id, { value: 3 }])),
    scenarios: { V3: { value: 3 } },
    scores: { x: 0, y: 0, c: 0, h: 0 },
    labels: {},
    projection: {},
    diagnostics: {},
    respondent_vector: {},
    profile_ranking: [],
    closest_statement: []
  };

  const response = await fetch(`${base}/api/submit-result`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => ({}));
  assert(response.ok, `/api/submit-result returned ${response.status}.`);
  if (health.storage?.configured) {
    assert(body.stored === true, "/api/submit-result must return stored:true when storage is configured.");
    return body;
  } else {
    assert(body.stored === false, "/api/submit-result must return stored:false before storage is configured.");
    assert(body.backend === "vercel-dynamic-unconfigured-storage", "/api/submit-result must report the dynamic unconfigured-storage backend.");
  }
  return body;
}

async function verifyAuthenticatedDataAccess(health, submittedResult) {
  if (!health.export?.configured) return;

  if (!exportToken) {
    if (requireConfigured) {
      assert(false, "Strict verification requires REMOTE_DATABASE_TOKEN, EXPORT_TOKEN, or RESULTS_EXPORT_TOKEN in the local shell.");
    } else {
      notes.push("authenticated results/export checks skipped because no local export token was provided.");
    }
    return;
  }

  const headers = { authorization: `Bearer ${exportToken}` };
  const storageHealthResponse = await fetch(`${base}/api/storage-health`, { headers, cache: "no-store" });
  const storageHealthBody = await storageHealthResponse.json().catch(() => ({}));
  assert(storageHealthResponse.ok, `/api/storage-health with token returned ${storageHealthResponse.status}.`);
  assert(storageHealthBody.ok === true, "/api/storage-health with token must return ok:true.");
  assert(storageHealthBody.configured === true, "/api/storage-health with token must return configured:true.");
  notes.push(`storage.table=${storageHealthBody.table || "unknown"}`);

  const resultsResponse = await fetch(`${base}/api/results`, { headers, cache: "no-store" });
  const resultsBody = await resultsResponse.json().catch(() => ({}));
  assert(resultsResponse.ok, `/api/results with token returned ${resultsResponse.status}.`);
  assert(resultsBody.ok === true, "/api/results with token must return ok:true.");
  assert(Array.isArray(resultsBody.rows), "/api/results with token must return rows.");
  notes.push(`results.count=${resultsBody.count ?? resultsBody.rows?.length ?? "unknown"}`);

  if (submittedResult?.id) {
    assert(
      resultsBody.rows.some((row) => row.id === submittedResult.id),
      `/api/results did not include the submitted verification row ${submittedResult.id}.`
    );
  }

  const csvResponse = await fetch(`${base}/api/export.csv`, { headers, cache: "no-store" });
  const csv = await csvResponse.text();
  assert(csvResponse.ok, `/api/export.csv with token returned ${csvResponse.status}.`);
  assert(csv.includes("created_at"), "/api/export.csv must include a CSV header.");
  if (submittedResult?.id) {
    assert(csv.includes(submittedResult.id), `/api/export.csv did not include the submitted verification row ${submittedResult.id}.`);
  }
}

async function verifyDns() {
  const checks = [
    {
      hostname: "linenyu.com",
      expectedA: ["216.198.79.1", "64.29.17.1"]
    },
    {
      hostname: "www.linenyu.com",
      expectedCname: "33236d9ab28d641f.vercel-dns-017.com"
    },
    {
      hostname: "ai-persona.linenyu.com",
      expectedCname: "33236d9ab28d641f.vercel-dns-017.com"
    }
  ];

  for (const check of checks) {
    const { hostname } = check;
    const addresses = await dns.resolve4(hostname).catch(() => []);
    const cnames = await dns.resolveCname(hostname).catch(() => []);
    notes.push(`${hostname}=${addresses.join(",") || "unresolved"}${cnames.length ? ` cname:${cnames.join(",")}` : ""}`);
    if (requireConfigured) {
      if (check.expectedA) {
        assert(
          check.expectedA.every((address) => addresses.includes(address)),
          `${hostname} must resolve to ${check.expectedA.join(" and ")}. Current: ${addresses.join(",") || "unresolved"}.`
        );
      }
      if (check.expectedCname) {
        assert(
          cnames.map(normalizeHostname).includes(normalizeHostname(check.expectedCname)),
          `${hostname} must resolve with CNAME ${check.expectedCname}. Current: ${cnames.join(",") || "none"}.`
        );
      }
    }
  }
}

function normalizeHostname(hostname) {
  return String(hostname || "").replace(/\.$/, "").toLowerCase();
}

async function verifyCustomDomains() {
  if (!requireConfigured) return;

  const rootResponse = await fetch("https://linenyu.com/", { cache: "no-store" });
  const rootText = await rootResponse.text();
  assert(rootResponse.ok, `https://linenyu.com/ returned ${rootResponse.status}.`);
  assert(rootText.includes("<title>Linen Yu</title>"), "https://linenyu.com/ must serve the personal mother site.");

  const wwwResponse = await fetch("https://www.linenyu.com/", {
    cache: "no-store",
    redirect: "manual"
  });
  const wwwLocation = wwwResponse.headers.get("location") || "";
  assert(
    wwwResponse.status >= 300 && wwwResponse.status < 400 && wwwLocation.startsWith("https://linenyu.com/"),
    `https://www.linenyu.com/ must redirect to https://linenyu.com/; got ${wwwResponse.status} ${wwwLocation || "(no location)"}.`
  );

  const aiPersonaResponse = await fetch("https://ai-persona.linenyu.com/", {
    cache: "no-store",
    redirect: "manual"
  });
  const aiPersonaLocation = aiPersonaResponse.headers.get("location") || "";
  assert(
    aiPersonaResponse.status >= 300 && aiPersonaResponse.status < 400 && aiPersonaLocation.includes("/en/"),
    `https://ai-persona.linenyu.com/ must redirect to /en/; got ${aiPersonaResponse.status} ${aiPersonaLocation || "(no location)"}.`
  );

  const aiPersonaEnglishResponse = await fetch("https://ai-persona.linenyu.com/en/", { cache: "no-store" });
  const aiPersonaEnglishText = await aiPersonaEnglishResponse.text();
  assert(aiPersonaEnglishResponse.ok, `https://ai-persona.linenyu.com/en/ returned ${aiPersonaEnglishResponse.status}.`);
  assert(
    aiPersonaEnglishText.includes("1 usage item plus 15 scored questions"),
    "https://ai-persona.linenyu.com/en/ must serve the English AI Persona quiz."
  );

  notes.push("custom domains=https ok");
}

await verifyPages();
const health = await verifyHealth();
await verifyResultsProtection(health);
const submittedResult = await verifySubmitEndpoint(health);
await verifyAuthenticatedDataAccess(health, submittedResult);
await verifyDns();
await verifyCustomDomains();

for (const note of notes) console.log(`- ${note}`);

if (failures.length) {
  console.error("Live Vercel verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Live Vercel verification passed.");
