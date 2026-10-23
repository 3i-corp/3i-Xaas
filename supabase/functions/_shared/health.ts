const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, OPTIONS",
  "access-control-allow-headers":
    "authorization, apikey, content-type, x-client-info, x-request-id",
  "access-control-max-age": "86400",
  "cache-control": "no-store",
};

function makeResponse(
  requestId: string,
  status: number,
  body: Record<string, unknown> | null,
  method: string,
): Response {
  const headers = new Headers(corsHeaders);
  headers.set("x-request-id", requestId);

  if (status === 405) {
    headers.set("allow", "GET, HEAD, OPTIONS");
  }

  if (body !== null) {
    headers.set("content-type", "application/json; charset=utf-8");
  }

  return new Response(
    body === null || method === "HEAD" ? null : JSON.stringify(body),
    { status, headers },
  );
}

/**
 * Public liveness probe for the Supabase Edge Runtime.
 *
 * Deliberately does not query the database or disclose environment variables.
 * A successful response confirms only that this function is executing.
 */
export function handleHealthRequest(request: Request): Response {
  const requestId = crypto.randomUUID();

  if (request.method === "OPTIONS") {
    return makeResponse(requestId, 204, null, request.method);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return makeResponse(
      requestId,
      405,
      {
        error: "method_not_allowed",
        message: "Use GET, HEAD, or OPTIONS.",
        requestId,
      },
      request.method,
    );
  }

  return makeResponse(
    requestId,
    200,
    {
      status: "ok",
      service: "3i-xaas",
      component: "supabase-edge-functions",
      timestamp: new Date().toISOString(),
      requestId,
    },
    request.method,
  );
}
