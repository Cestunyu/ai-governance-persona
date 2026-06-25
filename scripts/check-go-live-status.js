import { execFile } from "node:child_process";
import dns from "node:dns/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const base = (process.argv.find((arg) => arg.startsWith("--base=")) || "--base=https://linenyu-site.vercel.app")
  .slice("--base=".length)
  .replace(/\/+$/, "");
const strict = process.argv.includes("--strict");
const vercelApexIps = ["216.198.79.1", "64.29.17.1"];
const vercelDnsCname = "33236d9ab28d641f.vercel-dns-017.com";
const dnsTargets = [
  { domain: "linenyu.com", host: "@", expectedA: vercelApexIps },
  { domain: "www.linenyu.com", host: "www", expectedCname: vercelDnsCname },
  { domain: "ai-persona.linenyu.com", host: "ai-persona", expectedCname: vercelDnsCname }
];
const vercelProject = "linenyu-site";
const dnsResolvers = [
  { name: "local", servers: [] },
  { name: "cloudflare", servers: ["1.1.1.1"] },
  { name: "google", servers: ["8.8.8.8"] },
  { name: "quad9", servers: ["9.9.9.9"] }
];
const requiredVercelEnv = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const exportEnv = ["EXPORT_TOKEN", "RESULTS_EXPORT_TOKEN"];
const localToken = process.env.REMOTE_DATABASE_TOKEN || process.env.EXPORT_TOKEN || process.env.RESULTS_EXPORT_TOKEN || "";

const checks = [];
const actions = [];
let customDomainHttpsReady = false;

function addCheck(name, ok, detail) {
  checks.push({ name, ok, detail });
}

function addAction(action) {
  if (!actions.includes(action)) actions.push(action);
}

async function fetchJson(path, options = {}) {
  const response = await fetch(`${base}${path}`, { cache: "no-store", ...options });
  const text = await response.text();
  let body = {};
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 300) };
  }
  return { response, body };
}

async function checkLiveHealth() {
  try {
    const { response, body } = await fetchJson("/api/health");
    addCheck("Vercel dynamic health", response.ok && body.dynamic === true, `${response.status}, dynamic=${Boolean(body.dynamic)}`);

    const storageConfigured = body.storage?.configured === true;
    const exportConfigured = body.export?.configured === true;
    addCheck("Supabase storage configured on Vercel", storageConfigured, storageConfigured ? "configured" : `missing ${body.storage?.missing_env?.join(", ") || "storage env"}`);
    addCheck("Results viewer token configured on Vercel", exportConfigured, exportConfigured ? "configured" : "missing EXPORT_TOKEN or RESULTS_EXPORT_TOKEN");

    if (!storageConfigured) addAction("Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel production env.");
    if (!exportConfigured) addAction("Add EXPORT_TOKEN or RESULTS_EXPORT_TOKEN to Vercel production env.");

    return body;
  } catch (error) {
    addCheck("Vercel dynamic health", false, error.message);
    addAction("Check that the Vercel default deployment is reachable.");
    return {};
  }
}

async function checkStorageRead(health) {
  if (health.export?.configured !== true) {
    addCheck("Protected Supabase read check", false, "skipped until export token is configured");
    return;
  }
  if (!localToken) {
    addCheck("Protected Supabase read check", false, "skipped; no local REMOTE_DATABASE_TOKEN/EXPORT_TOKEN/RESULTS_EXPORT_TOKEN");
    addAction("Set local REMOTE_DATABASE_TOKEN to the same value as the production export token before strict verification.");
    return;
  }

  try {
    const { response, body } = await fetchJson("/api/storage-health", {
      headers: { authorization: `Bearer ${localToken}` }
    });
    addCheck("Protected Supabase read check", response.ok && body.ok === true, response.ok ? `table=${body.table || "unknown"}` : `${response.status}: ${body.error || "failed"}`);
    if (!response.ok || body.ok !== true) addAction("Verify the Supabase table exists and the service-role key is valid.");
  } catch (error) {
    addCheck("Protected Supabase read check", false, error.message);
  }
}

async function checkCustomDomainHttps() {
  const checks = [
    {
      name: "Custom-domain HTTPS linenyu.com",
      url: "https://linenyu.com/",
      expectedText: "<title>Linen Yu</title>"
    },
    {
      name: "Custom-domain HTTPS www.linenyu.com",
      url: "https://www.linenyu.com/",
      expectedText: "<title>Linen Yu</title>"
    },
    {
      name: "Custom-domain HTTPS ai-persona.linenyu.com/en/",
      url: "https://ai-persona.linenyu.com/en/",
      expectedText: "1 usage item plus 15 scored questions"
    }
  ];

  let allOk = true;

  for (const check of checks) {
    try {
      const response = await fetch(check.url, { cache: "no-store" });
      const text = await response.text();
      const ok = response.ok && text.includes(check.expectedText);
      addCheck(check.name, ok, ok ? `${response.status}, Vercel HTTPS ok` : `${response.status}, expected content not found`);
      allOk = allOk && ok;
      if (!ok) addAction("Issue or refresh the Vercel certificate and verify the custom-domain routing.");
    } catch (error) {
      addCheck(check.name, false, error.message);
      allOk = false;
      addAction("Issue or refresh the Vercel certificate and verify the custom-domain routing.");
    }
  }

  try {
    const response = await fetch("https://ai-persona.linenyu.com/", {
      cache: "no-store",
      redirect: "manual"
    });
    const location = response.headers.get("location") || "";
    const ok = response.status >= 300 && response.status < 400 && location.includes("/en/");
    addCheck("Custom-domain HTTPS ai-persona root redirect", ok, `${response.status}${location ? ` -> ${location}` : ""}`);
    allOk = allOk && ok;
    if (!ok) addAction("Verify that ai-persona.linenyu.com redirects from / to /en/.");
  } catch (error) {
    addCheck("Custom-domain HTTPS ai-persona root redirect", false, error.message);
    allOk = false;
    addAction("Issue or refresh the Vercel certificate and verify the custom-domain routing.");
  }

  customDomainHttpsReady = allOk;
}

async function checkDns() {
  const nameservers = await dns.resolveNs("linenyu.com").catch(() => []);
  addCheck(
    "DNS provider",
    nameservers.length > 0,
    nameservers.length ? nameservers.join(",") : "nameservers unresolved"
  );

  for (const target of dnsTargets) {
    const localResult = await resolveDnsTarget(target);
    const { addresses, cnames } = localResult;
    const staleCnames = cnames.filter((cname) => /dnsoe|edgeone|pages/i.test(cname));
    const ok = localResult.ok;
    const want = `want Spaceship DNS: ${describeDnsTarget(target)}`;
    const current = `A=${addresses.join(",") || "unresolved"}${cnames.length ? ` CNAME=${cnames.join(",")}` : ""}`;
    addCheck(`DNS ${target.domain}`, ok, `${current}; ${want}`);

    for (const cname of staleCnames) {
      addAction(`In Spaceship DNS, delete CNAME ${target.host} -> ${cname}.`);
    }
    if (!ok && customDomainHttpsReady && staleCnames.length === 0) {
      addAction("If Spaceship already shows the recommended Vercel records, wait for DNS cache to expire and rerun npm run vercel:go-live:status.");
    } else {
      if (target.expectedCname && !hasExpectedCname(cnames, target.expectedCname)) {
        addAction(`In Spaceship DNS, add CNAME ${target.host} -> ${target.expectedCname}.`);
      }
      if (target.expectedA && !hasExpectedA(addresses, target.expectedA)) {
        addAction(`In Spaceship DNS, add A ${target.host} -> ${target.expectedA.join(" and ")}.`);
      }
      const oldAddresses = target.expectedA ? addresses.filter((address) => !target.expectedA.includes(address)) : addresses;
      if (oldAddresses.length && !target.expectedCname) {
        addAction(`In Spaceship DNS, remove old A ${target.host} -> ${oldAddresses.join(", ")}.`);
      }
      if (target.expectedCname && addresses.includes("76.76.21.21") && !cnames.length) {
        addAction(`In Spaceship DNS, replace A ${target.host} -> 76.76.21.21 with CNAME ${target.host} -> ${target.expectedCname}.`);
      }
    }

    const resolverResults = await Promise.all(dnsResolvers.map((resolver) => resolveDnsTarget(target, resolver)));
    const propagationOk = resolverResults.every((result) => result.ok);
    const summary = resolverResults
      .map((result) => `${result.resolverName}=${result.addresses.join("/") || "unresolved"}${result.cnames.length ? ` cname:${result.cnames.join("/")}` : ""}`)
      .join("; ");
    addCheck(`DNS propagation ${target.domain}`, propagationOk, `${summary}; want ${describeDnsTarget(target)}`);
    if (!propagationOk) addAction("After editing Spaceship DNS, rerun npm run vercel:go-live:status until all DNS propagation checks are [ok].");
  }
}

async function checkVercelDomains() {
  const results = await Promise.all(dnsTargets.map((target) => inspectVercelDomain(target.domain)));
  for (const result of results) {
    addCheck(
      `Vercel domain binding ${result.domain}`,
      result.bound,
      result.bound ? `bound to ${vercelProject}` : result.error || "not bound"
    );
    if (!result.bound) addAction(`Add ${result.domain} to Vercel project ${vercelProject}.`);

    addCheck(
      `Vercel domain configuration ${result.domain}`,
      result.configured,
      result.configured ? "configured" : result.warning || "DNS not configured properly"
    );
  }
}

async function inspectVercelDomain(domain) {
  try {
    const result = await execFileAsync("npx", ["vercel", "domains", "inspect", domain], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024
    });
    const output = `${result.stdout}\n${result.stderr}`;
    return {
      domain,
      bound: output.includes(vercelProject) && output.includes(domain),
      configured: !/not configured properly/i.test(output),
      warning: domainRecordHint(output) || "DNS not configured properly"
    };
  } catch (error) {
    const output = `${error.stdout || ""}\n${error.stderr || ""}\n${error.message || ""}`;
    return {
      domain,
      bound: false,
      configured: false,
      error: output.trim() || "Vercel domain inspect failed",
      warning: domainRecordHint(output) || "Vercel domain inspect failed"
    };
  }
}

function domainRecordHint(output) {
  const match = String(output || "").match(/Set the following record.*?`([^`]+)`/is);
  return match ? `needs ${match[1]}` : "";
}

async function resolveDnsTarget(target, resolver = dnsResolvers[0]) {
  const client = resolver.servers.length ? new dns.Resolver() : dns;
  if (resolver.servers.length) client.setServers(resolver.servers);

  const [addresses, cnames] = await Promise.all([
    client.resolve4(target.domain).catch(() => []),
    client.resolveCname(target.domain).catch(() => [])
  ]);
  const staleCnames = cnames.filter((cname) => /dnsoe|edgeone|pages/i.test(cname));
  return {
    resolverName: resolver.name,
    addresses,
    cnames,
    ok: dnsTargetOk(target, addresses, cnames) && staleCnames.length === 0
  };
}

function dnsTargetOk(target, addresses, cnames) {
  if (target.expectedCname) return hasExpectedCname(cnames, target.expectedCname);
  if (target.expectedA) return hasExpectedA(addresses, target.expectedA);
  return false;
}

function hasExpectedA(addresses, expected) {
  return expected.every((address) => addresses.includes(address));
}

function hasExpectedCname(cnames, expected) {
  return cnames.map(normalizeHostname).includes(normalizeHostname(expected));
}

function normalizeHostname(hostname) {
  return String(hostname || "").replace(/\.$/, "").toLowerCase();
}

function describeDnsTarget(target) {
  if (target.expectedCname) return `${target.host} CNAME ${target.expectedCname}`;
  return `${target.host} A ${target.expectedA.join(" and ")}`;
}

async function checkVercelEnvList() {
  let output = "";
  try {
    const result = await execFileAsync("npx", ["vercel", "env", "ls", "production", "--format", "json"], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024
    });
    output = `${result.stdout}\n${result.stderr}`;
  } catch (error) {
    output = `${error.stdout || ""}\n${error.stderr || ""}\n${error.message || ""}`;
  }

  const envNames = parseVercelEnvNames(output);
  for (const name of requiredVercelEnv) {
    const ok = envNames.has(name);
    addCheck(`Vercel env ${name}`, ok, ok ? "present" : "missing");
    if (!ok) addAction("Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel production env.");
  }

  const exportOk = exportEnv.some((name) => envNames.has(name));
  addCheck("Vercel env export token", exportOk, exportOk ? "present" : "missing");
  if (!exportOk) addAction("Add EXPORT_TOKEN or RESULTS_EXPORT_TOKEN to Vercel production env.");
}

function parseVercelEnvNames(output) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd < jsonStart) return new Set();

  try {
    const payload = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
    return new Set((payload.envs || []).map((env) => env.key || env.name).filter(Boolean));
  } catch {
    return new Set();
  }
}

async function main() {
  console.log(`Go-live status for ${base}`);

  const health = await checkLiveHealth();
  await checkStorageRead(health);
  await checkVercelDomains();
  await checkCustomDomainHttps();
  await checkDns();
  await checkVercelEnvList();

  console.log("\nChecks:");
  for (const check of checks) {
    console.log(`${check.ok ? "[ok]" : "[todo]"} ${check.name}: ${check.detail}`);
  }

  if (actions.length) {
    console.log("\nNext actions:");
    for (const action of actions) console.log(`- ${action}`);
  } else {
    console.log("\nNext actions: none.");
  }

  if (strict && checks.some((check) => !check.ok)) {
    process.exit(1);
  }
}

await main();
