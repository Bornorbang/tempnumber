// Node 22+: node --experimental-strip-types scripts/generate-usa-openapi.mjs
import { writeFileSync } from "node:fs";
import { USA_API_ENDPOINTS } from "../src/lib/usa-api-docs.ts";

function schema(value, field = "") {
  if (field === "code") return { type: "string", nullable: true };
  if (field === "next_cursor") return { type: "integer", nullable: true };
  if (field === "end_time") return { type: "string", nullable: true };
  if (Array.isArray(value)) return { type: "array", items: schema(value[0]) };
  if (value && typeof value === "object") return {
    type: "object", required: Object.keys(value),
    properties: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, schema(item, key)])),
  };
  if (typeof value === "number") return { type: ["id", "stock", "ttl"].includes(field) ? "integer" : "number" };
  if (typeof value === "boolean") return { type: "boolean" };
  return { type: "string", ...(["country", "currency"].includes(field) ? { enum: [value] } : {}) };
}
const paths = {};
for (const endpoint of USA_API_ENDPOINTS) {
  const operation = {
    operationId: endpoint.path.slice(1), summary: endpoint.title, description: endpoint.description,
    responses: {
      [endpoint.path === "/rent" ? "201" : "200"]: {
        description: "Success. Purchase replays return the original response and balance snapshot.",
        headers: Object.fromEntries(["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"].map(name => [name, { schema: { type: "integer" } }])),
        content: { "application/json": { schema: schema(endpoint.response), example: endpoint.response } },
      },
      default: { $ref: "#/components/responses/ApiError" },
      "429": { $ref: "#/components/responses/RateLimited" },
    },
  };
  if (endpoint.request) {
    const bodySchema = schema(endpoint.request);
    bodySchema.additionalProperties = false;
    if (endpoint.path === "/rent") {
      bodySchema.required = ["service"];
      bodySchema.properties.service = { type: "string", minLength: 1, maxLength: 100 };
      bodySchema.properties.max_price_ngn = { type: "number", minimum: 0, exclusiveMinimum: true, maximum: 99999999 };
      operation.parameters = [{ name: "Idempotency-Key", in: "header", required: true, schema: { type: "string", pattern: "^[A-Za-z0-9_.:-]{8,128}$" }, description: "Save one key per order; always reuse the key and body on retries." }];
      operation.responses["201"].headers["Idempotency-Replayed"] = { schema: { type: "boolean" } };
    } else bodySchema.properties.id.minimum = 1;
    operation.requestBody = { required: true, content: { "application/json": { schema: bodySchema, example: endpoint.request } } };
  }
  if (endpoint.path === "/rentals") operation.parameters = [
    { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 50 } },
    { name: "before", in: "query", description: "The previous page's next_cursor.", schema: { type: "integer", minimum: 1 } },
  ];
  paths[endpoint.path] = { [endpoint.method.toLowerCase()]: operation };
}
const errorContent = { "application/json": { schema: { type: "object", required: ["error", "code"], properties: { error: { type: "string" }, code: { type: "string" }, request_id: { type: "string" }, reserved_ngn: { type: "number" }, price_ngn: { type: "number" }, retry_after: { type: "integer" } } } } };
const spec = {
  openapi: "3.0.3",
  info: { title: "Temp Number USA Reseller API", version: "1.0.0", description: "USA short-term numbers only. Server-to-server authentication. NGN wallet billing. 60 requests/minute/account, 10 active or pending USA orders. On timeout or order_pending, retry the SAME Idempotency-Key and body; never place a replacement order. Contact support with request_id if confirmation remains pending. No global, dedicated, long-term or email products. Polling only; customer webhooks are not provided.", contact: { email: "support@tempnumber.ng" } },
  servers: [{ url: "https://tempnumber.ng/api/v1" }, { url: "http://localhost:3002/api/v1", description: "Local development" }],
  security: [{ ApiKey: [] }], paths,
  components: {
    securitySchemes: { ApiKey: { type: "apiKey", in: "header", name: "X-API-Key" } },
    responses: {
      ApiError: { description: "Use HTTP status and code. Order retries must reuse the same key and body. See /developers for all error codes.", content: errorContent },
      RateLimited: { description: "Account rate limit exceeded. Wait Retry-After seconds.", headers: { "Retry-After": { schema: { type: "integer" } } }, content: errorContent },
    },
  },
};
writeFileSync(new URL("../public/usa-api.openapi.json", import.meta.url), JSON.stringify(spec, null, 2) + "\n");
console.log("Generated OpenAPI specification for " + Object.keys(paths).length + " USA endpoints.");
