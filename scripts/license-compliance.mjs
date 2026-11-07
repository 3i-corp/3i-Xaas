#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "config/license-policy.json");
const LOCK_PATH = path.join(ROOT, "package-lock.json");

function parseExpression(input) {
  if (typeof input !== "string" || !input.trim()) throw new Error("empty license expression");
  const tokens = [];
  const re = /\s*(\(|\)|AND\b|OR\b|WITH\b|[A-Za-z0-9.+:-]+)\s*/gy;
  let pos = 0;
  while (pos < input.length) {
    re.lastIndex = pos;
    const m = re.exec(input);
    if (!m || m.index !== pos) throw new Error(`invalid token near "${input.slice(pos)}"`);
    tokens.push(m[1]); pos = re.lastIndex;
  }
  let i = 0;
  const atom = () => {
    if (tokens[i] === "(") {
      i++;
      const node = orExpr();
      if (tokens[i++] !== ")") throw new Error("missing closing parenthesis");
      return node;
    }
    const id = tokens[i++];
    if (!id || ["AND", "OR", "WITH", ")"].includes(id)) throw new Error("expected SPDX license identifier");
    let exception = null;
    if (tokens[i] === "WITH") {
      i++;
      exception = tokens[i++];
      if (!exception || ["AND", "OR", "WITH", "(", ")"].includes(exception)) throw new Error("expected SPDX exception identifier");
    }
    return { type: "license", id, exception };
  };
  const andExpr = () => {
    let node = atom();
    while (tokens[i] === "AND") { i++; node = { type: "and", left: node, right: atom() }; }
    return node;
  };
  const orExpr = () => {
    let node = andExpr();
    while (tokens[i] === "OR") { i++; node = { type: "or", left: node, right: andExpr() }; }
    return node;
  };
  const ast = orExpr();
  if (i !== tokens.length) throw new Error(`unexpected token "${tokens[i]}"`);
  return ast;
}

function classify(ast, policy) {
  if (ast.type === "license") {
    if (ast.exception) return "REVIEW_REQUIRED";
    if (policy.allowed.includes(ast.id)) return "PASS";
    if (policy.reviewRequired.includes(ast.id)) return "REVIEW_REQUIRED";
    if (policy.restricted.includes(ast.id)) return "FAIL";
    return "FAIL";
  }
  const a = classify(ast.left, policy);
  const b = classify(ast.right, policy);
  const rank = { PASS: 0, REVIEW_REQUIRED: 1, FAIL: 2 };
  if (ast.type === "and") return rank[a] >= rank[b] ? a : b;
  return rank[a] <= rank[b] ? a : b;
}

function runSelfTests(policy) {
  const cases = [
    ["MIT", "PASS"], ["Apache-2.0 AND MIT", "PASS"],
    ["GPL-3.0-only", "REVIEW_REQUIRED"],
    ["LGPL-3.0-or-later", "REVIEW_REQUIRED"],
    ["MPL-2.0", "REVIEW_REQUIRED"],
    ["CC-BY-4.0", "REVIEW_REQUIRED"],
    ["MIT OR GPL-3.0-only", "PASS"],
    ["MIT AND GPL-3.0-only", "REVIEW_REQUIRED"],
    ["AGPL-3.0-only", "FAIL"], ["LicenseRef-Unknown", "FAIL"]
  ];
  for (const [expr, expected] of cases) {
    const actual = classify(parseExpression(expr), policy);
    if (actual !== expected) throw new Error(`self-test failed: ${expr}: expected ${expected}, got ${actual}`);
  }
  for (const malformed of ["", "MIT AND", "(MIT", "MIT OR OR Apache-2.0"]) {
    let rejected = false;
    try { parseExpression(malformed); } catch { rejected = true; }
    if (!rejected) throw new Error(`self-test accepted malformed expression: ${malformed}`);
  }
  return cases.length + 4;
}

function main() {
  let policy, lock;
  try {
    policy = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    lock = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));
    if (policy.schemaVersion !== 1 || policy.projectLicense !== "GPL-3.0" ||
        !Array.isArray(policy.allowed) || !Array.isArray(policy.reviewRequired) ||
        !Array.isArray(policy.restricted) || !Array.isArray(policy.firstPartyWorkspacePaths) ||
        !Array.isArray(policy.blockStatuses) || !lock.packages || lock.lockfileVersion !== 3) {
      throw new Error("policy or npm lockfile schema is invalid");
    }
    for (const id of [...policy.allowed, ...policy.reviewRequired, ...policy.restricted]) {
      if (typeof id !== "string" || !id.trim()) throw new Error("policy contains an invalid license identifier");
    }
  } catch (error) {
    console.error(`CONFIGURATION_ERROR: ${error.message}`);
    process.exit(2);
  }

  if (process.argv.includes("--self-test")) {
    try { console.log(`PASS: ${runSelfTests(policy)} license parser/classifier tests`); }
    catch (error) { console.error(`FAIL: ${error.message}`); process.exit(1); }
    return;
  }

  const rows = [];
  for (const [pkgPath, meta] of Object.entries(lock.packages)) {
    if (!pkgPath.startsWith("node_modules/")) continue;
    const name = pkgPath.slice("node_modules/".length);
    if (meta.link === true && typeof meta.resolved === "string" &&
        policy.firstPartyWorkspacePaths.includes(meta.resolved)) {
      rows.push({ package: name, version: meta.version ?? "(workspace)", license: "(first-party workspace; ownership review pending)", scope: "workspace", status: "REVIEW_REQUIRED", reason: "Confirm company ownership and contributor/contractor rights" });
      continue;
    }
    if (typeof meta.license !== "string" || !meta.license.trim()) {
      rows.push({ package: name, version: meta.version ?? "unknown", license: "(missing)", scope: meta.dev ? "dev" : meta.optional ? "optional" : "prod", status: "FAIL", reason: "Third-party license metadata is missing" });
      continue;
    }
    try {
      const status = classify(parseExpression(meta.license), policy);
      rows.push({ package: name, version: meta.version ?? "unknown", license: meta.license, scope: meta.dev ? "dev" : meta.optional ? "optional" : "prod", status, reason: status === "FAIL" ? "Restricted or unrecognized license; release blocked pending review" : status === "REVIEW_REQUIRED" ? "Contextual legal/technical review and evidence required" : "Allowed intake category; preserve notices" });
    } catch (error) {
      rows.push({ package: name, version: meta.version ?? "unknown", license: meta.license, scope: meta.dev ? "dev" : meta.optional ? "optional" : "prod", status: "FAIL", reason: `Invalid SPDX expression: ${error.message}` });
    }
  }

  const counts = { PASS: 0, REVIEW_REQUIRED: 0, FAIL: 0 };
  for (const row of rows) counts[row.status]++;
  const report = { generatedAt: new Date().toISOString(), projectLicense: policy.projectLicense, lockfileVersion: lock.lockfileVersion, packagesScanned: rows.length, counts, results: rows };
  console.log(JSON.stringify(report, null, 2));

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    const lines = [
      "## License compliance pilot scan",
      `- Project license: ${policy.projectLicense}`,
      `- Lockfile entries scanned: ${rows.length}`,
      `- PASS: ${counts.PASS} | REVIEW_REQUIRED: ${counts.REVIEW_REQUIRED} | FAIL: ${counts.FAIL}`,
      "",
      "| Status | Package | Version | License expression | Scope |",
      "|---|---|---|---|---|",
      ...rows.filter(r => r.status !== "PASS").map(r => `| ${r.status} | ${r.package} | ${r.version} | ${r.license} | ${r.scope} |`)
    ];
    fs.appendFileSync(summaryPath, lines.join("\n") + "\n");
  }
  if (policy.blockStatuses.some(status => counts[status] > 0)) process.exit(1);
}

main();
