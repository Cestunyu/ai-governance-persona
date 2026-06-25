import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const environment = process.argv.find((arg) => !arg.startsWith("--") && arg !== process.argv[1] && arg !== process.argv[0]) || "production";
const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const exportAlternatives = ["EXPORT_TOKEN", "RESULTS_EXPORT_TOKEN"];

function parseVercelEnvNames(output) {
  const jsonStart = output.indexOf("{");
  const jsonEnd = output.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd < jsonStart) return new Set();
  const payload = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
  return new Set((payload.envs || []).map((env) => env.key || env.name).filter(Boolean));
}

async function main() {
  const result = await execFileAsync("npx", ["vercel", "env", "ls", environment, "--format", "json"], {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024
  });
  const envNames = parseVercelEnvNames(`${result.stdout}\n${result.stderr}`);

  const missing = required.filter((name) => !envNames.has(name));
  const hasExportToken = exportAlternatives.some((name) => envNames.has(name));
  if (!hasExportToken) missing.push("EXPORT_TOKEN or RESULTS_EXPORT_TOKEN");

  if (missing.length) {
    console.error(`Vercel ${environment} env is incomplete. Missing: ${missing.join(", ")}.`);
    console.error("Set the values with: scripts/set-vercel-production-env.sh production");
    process.exit(1);
  }

  console.log(`Vercel ${environment} env names are ready.`);
}

await main().catch((error) => {
  console.error(error.message || "Vercel env readiness check failed.");
  process.exit(1);
});
