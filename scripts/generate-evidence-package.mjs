#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const output = path.join(root, "artifacts/license-compliance/generated-per-run");
const inputs = ["package.json", "package-lock.json", "LICENSE", "config/license-policy.json", "scripts/license-compliance.mjs", "scripts/generate-evidence-package.mjs"];

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex");
}

function main() {
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  const scan = spawnSync(process.execPath, ["scripts/license-compliance.mjs"], {
    cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024
  });
  if (scan.error) throw scan.error;
  if (scan.status !== 0) {
    process.stderr.write(scan.stderr || scan.stdout || "License scan failed.\n");
    process.exit(scan.status || 1);
  }
  let report;
  try { report = JSON.parse(scan.stdout); }
  catch { throw new Error("License scanner did not return valid JSON."); }

  fs.writeFileSync(path.join(output, "license-scan.json"), JSON.stringify(report, null, 2) + "\n");
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY || "local",
    commit: process.env.GITHUB_SHA || "local-uncommitted",
    workflow: process.env.GITHUB_WORKFLOW || "local",
    runId: process.env.GITHUB_RUN_ID || null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
    projectLicense: report.projectLicense,
    lockfileVersion: report.lockfileVersion,
    packagesScanned: report.packagesScanned,
    counts: report.counts,
    inputDigests: Object.fromEntries(inputs.map(file => [file, sha256(file)])),
    limitations: [
      "npm lockfile metadata scan only",
      "not a complete SBOM or legal compliance certification",
      "does not verify upstream license texts or actual delivered artifacts",
      "does not cover GitHub Actions, containers, system packages, fonts, media, datasets or vendored assets"
    ]
  };
  fs.writeFileSync(path.join(output, "evidence-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(output, "README.md"), [
    "# 3i-XaaS License Evidence Package",
    "",
    "- Generated from the checked-out repository state by CI.",
    "- license-scan.json contains the npm lockfile license scan.",
    "- evidence-manifest.json records run metadata and SHA-256 input digests.",
    "- Review all REVIEW_REQUIRED findings and complete the ownership, distribution and legal templates.",
    "- This package is not a complete SBOM, legal opinion, compliance certification or release authorization.",
    ""
  ].join("\n"));
  console.log(JSON.stringify({ output: "artifacts/license-compliance/generated-per-run", packagesScanned: report.packagesScanned, counts: report.counts }, null, 2));
}

try { main(); }
catch (error) { console.error("EVIDENCE_GENERATION_FAILED: " + error.message); process.exit(1); }
