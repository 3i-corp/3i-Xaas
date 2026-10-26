const target = process.env.CSP_TEST_URL;

function report(status, message) {
  console.log(`CSP_STATUS=${status}`);
  console.log(message);
}

if (!target) {
  report("FAIL", "CSP_TEST_URL is required; deployed CSP was not checked.");
  process.exit(1);
}

let url;
try {
  url = new URL(target);
} catch {
  report("FAIL", "CSP_TEST_URL is not a valid URL.");
  process.exit(1);
}

if (url.protocol !== "https:") {
  report("FAIL", "CSP_TEST_URL must use HTTPS.");
  process.exit(1);
}

function parsePolicy(policy) {
  const directives = new Map();

  for (const part of policy.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;

    const name = tokens[0].toLowerCase();

    // CSP ignores later occurrences of a duplicate directive in a policy.
    if (!directives.has(name)) {
      directives.set(name, tokens.slice(1));
    }
  }

  return directives;
}

try {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  if (new URL(response.url).protocol !== "https:") {
    report("FAIL", "Final redirect destination is not HTTPS.");
    process.exit(1);
  }

  if (response.status < 200 || response.status >= 300) {
    report("FAIL", `Unexpected final HTTP status: ${response.status}.`);
    process.exit(1);
  }

  const enforced = response.headers.get("content-security-policy");
  const reportOnly = response.headers.get("content-security-policy-report-only");

  if (!enforced) {
    report(
      "FAIL",
      reportOnly
        ? "Only CSP Report-Only was found; enforcement is not confirmed."
        : "No enforced Content-Security-Policy header found."
    );
    process.exit(1);
  }

  // Multiple CSP policies are cumulative. Browsers enforce each policy, so
  // required protections may be supplied by separate policies. A comma is
  // the field-value separator when multiple CSP headers are combined.
  const policies = enforced.split(",");
  const parsedPolicies = policies.map(parsePolicy);

  const hasDefaultSrc = parsedPolicies.some((policy) =>
    policy.has("default-src")
  );

  const hasObjectSrcNone = parsedPolicies.some((policy) => {
    const values = policy.get("object-src");
    return values?.length === 1 && values[0].toLowerCase() === "'none'";
  });

  if (!hasDefaultSrc) {
    report("FAIL", "Enforced CSP lacks default-src.");
    process.exit(1);
  }

  if (!hasObjectSrcNone) {
    report("FAIL", "Enforced CSP lacks object-src 'none'.");
    process.exit(1);
  }

  report("PASS", `Enforced CSP header found; final HTTP ${response.status}.`);
} catch (error) {
  report("FAIL", `Unable to verify CSP: ${error.message}`);
  process.exit(1);
}
