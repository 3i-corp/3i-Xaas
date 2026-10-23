import { handleHealthRequest } from "./health.ts";

Deno.test("GET returns liveness metadata without environment details", async () => {
  const response = handleHealthRequest(
    new Request("https://example.test/functions/v1/health"),
  );
  const body = await response.json();

  if (response.status !== 200) {
    throw new Error(`Expected 200, received ${response.status}`);
  }
  if (body.status !== "ok" || body.service !== "3i-xaas") {
    throw new Error("Health response is missing the expected service status.");
  }
  if (!body.timestamp || !body.requestId) {
    throw new Error("Health response must include timestamp and requestId.");
  }
  if ("env" in body || "secrets" in body || "projectId" in body) {
    throw new Error("Health response must not expose environment details.");
  }
  if (response.headers.get("cache-control") !== "no-store") {
    throw new Error("Health response must not be cached.");
  }
});

Deno.test("HEAD returns headers without a response body", async () => {
  const response = handleHealthRequest(
    new Request("https://example.test/functions/v1/health", {
      method: "HEAD",
    }),
  );

  if (response.status !== 200 || (await response.text()) !== "") {
    throw new Error("HEAD should return HTTP 200 with an empty body.");
  }
});

Deno.test("OPTIONS supports browser preflight", () => {
  const response = handleHealthRequest(
    new Request("https://example.test/functions/v1/health", {
      method: "OPTIONS",
    }),
  );

  if (response.status !== 204) {
    throw new Error(`Expected 204, received ${response.status}`);
  }
  if (!response.headers.get("access-control-allow-methods")?.includes("GET")) {
    throw new Error("CORS methods must include GET.");
  }
});

Deno.test("unsupported methods return 405 with Allow header", async () => {
  const response = handleHealthRequest(
    new Request("https://example.test/functions/v1/health", {
      method: "POST",
    }),
  );
  const body = await response.json();

  if (response.status !== 405 || body.error !== "method_not_allowed") {
    throw new Error("Unsupported methods should return a 405 error.");
  }
  if (response.headers.get("allow") !== "GET, HEAD, OPTIONS") {
    throw new Error("405 responses must include Allow: GET, HEAD, OPTIONS.");
  }
});
