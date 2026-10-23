import { handleHealthRequest } from "../_shared/health.ts";

// This endpoint is intentionally public and exposes liveness metadata only.
Deno.serve(handleHealthRequest);
