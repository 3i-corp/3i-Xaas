import assert from "node:assert/strict";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

assert.ok(supabaseUrl, "SUPABASE_URL must be set by the local Supabase CI workflow");
assert.ok(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY must be set by the local Supabase CI workflow");

async function assertHttpOk(label, url, headers = {}) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.text();

  assert.equal(
    response.status,
    200,
    `${label} expected HTTP 200, received ${response.status}. Response: ${body.slice(0, 300)}`
  );
  console.log(`PASS ${label} (HTTP ${response.status})`);
}

const authHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

await assertHttpOk("Supabase Auth health endpoint", `${supabaseUrl}/auth/v1/health`, authHeaders);
await assertHttpOk("Supabase REST/PostgREST endpoint", `${supabaseUrl}/rest/v1/`, authHeaders);
console.log("Supabase local integration smoke tests passed.");
