"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { USA_API_ENDPOINTS, USA_API_ERRORS } from "@/lib/usa-api-docs";

function Code({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="relative">
    <button type="button" className="absolute right-2 top-2 rounded bg-[var(--bg-card)] px-2 py-1 text-xs text-green-500" onClick={async () => {
      try { await navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); }
    }} aria-label="Copy code example">{copied ? "Copied" : "Copy"}</button>
    <pre className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] p-4 pt-10 text-xs leading-6 text-[var(--text-primary)]"><code>{children}</code></pre>
  </div>;
}

const subscribeToOrigin = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "https://tempnumber.ng";

export default function UsaApiDocumentation() {
  const base = `${useSyncExternalStore(subscribeToOrigin, getOrigin, getServerOrigin)}/api/v1`;
  const [language, setLanguage] = useState<"curl" | "Node.js" | "PHP">("curl");
  const examples = {
    curl: `# Run on your server. Keep the same order key and body for retries.\nexport TEMP_NUMBER_API_KEY='tn_REPLACE_WITH_YOUR_KEY'\n\ncurl '${base}/prices' \\\n  -H "X-API-Key: $TEMP_NUMBER_API_KEY"\n\ncurl '${base}/rent' \\\n  -H "X-API-Key: $TEMP_NUMBER_API_KEY" \\\n  -H 'Content-Type: application/json' \\\n  -H 'Idempotency-Key: your-platform-order-1001' \\\n  -d '{"service":"whatsapp","max_price_ngn":2000}'\n\n# Replace 12345 with the id from your order response.\ncurl '${base}/status' \\\n  -H "X-API-Key: $TEMP_NUMBER_API_KEY" \\\n  -H 'Content-Type: application/json' \\\n  -d '{"id":12345}'`,
    "Node.js": `// Server-side Node.js. Save orderKey and body with your own order first.\nconst base = '${base}';\nconst orderKey = 'your-platform-order-1001';\nconst body = { service: 'whatsapp', max_price_ngn: 2000 };\nconst response = await fetch(base + '/rent', {\n  method: 'POST',\n  headers: {\n    'X-API-Key': process.env.TEMP_NUMBER_API_KEY,\n    'Content-Type': 'application/json',\n    'Idempotency-Key': orderKey,\n  },\n  body: JSON.stringify(body),\n});\nconst result = await response.json();\nif (!response.ok) {\n  // Persist the result; handle result.code as documented below.\n  // On timeout / order_pending, retry the SAME orderKey and body.\n  throw new Error(result.code + ': ' + result.error);\n}\n// Save result.id against your customer's order.\nconsole.log(result.id, result.number);`,
    PHP: `<?php\n// On your backend; never put this key in browser JavaScript.\n$orderKey = 'your-platform-order-1001'; // Persist before sending.\n$ch = curl_init('${base}/rent');\ncurl_setopt_array($ch, [\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_POST => true,\n    CURLOPT_TIMEOUT => 50,\n    CURLOPT_HTTPHEADER => [\n        'X-API-Key: ' . getenv('TEMP_NUMBER_API_KEY'),\n        'Content-Type: application/json',\n        'Idempotency-Key: ' . $orderKey,\n    ],\n    CURLOPT_POSTFIELDS => json_encode([\n        'service' => 'whatsapp', 'max_price_ngn' => 2000,\n    ]),\n]);\n$raw = curl_exec($ch);\n$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);\ncurl_close($ch);\nif ($raw === false) {\n    // Outcome unknown: retry the SAME key and body, never a new key.\n    throw new RuntimeException('Order needs confirmation');\n}\n$result = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);\nif ($status !== 201) {\n    throw new RuntimeException($result['code'] . ': ' . $result['error']);\n}\n// Store $result['id'] against your customer's order.`,
  };
  const card = "rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6 space-y-4";
  return <div className="space-y-6 text-sm text-[var(--text-secondary)]">
    <section className={card}>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Build your USA number platform</h2>
      <p>Your customers buy from your platform. Your backend orders a USA number from Temp Number, your Temp Number wallet pays for it, and your backend retrieves the SMS code for your customer. You control your own retail prices and customer billing.</p>
      <p>This API covers the USA dashboard&apos;s short-term numbers. Global numbers, long-term rentals, dedicated numbers and temporary email are not available through this API. Version 1 uses polling; customer webhook delivery is not provided.</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li><Link href="/dashboard/api" className="text-green-500 hover:underline">Generate an API key</Link> and save it in your server&apos;s environment variables.</li>
        <li><Link href="/dashboard/wallet" className="text-green-500 hover:underline">Fund your wallet</Link>, then fetch services and current NGN prices.</li>
        <li>Save a unique order key in your database, order a number, and store the returned rental id.</li>
        <li>Poll for the code and deliver it to the customer who owns that order on your platform.</li>
      </ol>
      <Code>{base}</Code>
      <p>Authenticate every request with <code className="text-green-500">X-API-Key: tn_...</code>. Send JSON for POST requests. API keys are for server-to-server use; never embed them in a frontend, mobile app, public repository, or URL.</p>
      <a href="/usa-api.openapi.json" download className="inline-flex rounded-lg border border-green-500/40 px-4 py-2 font-medium text-green-500 hover:bg-green-500/10">Download OpenAPI specification</a>
    </section>
    <section className={card}>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick start</h2>
      <p>Prices and IDs below are examples. Choose a service and spending cap from the live catalog.</p>
      <div className="flex gap-2" aria-label="Example language">{(["curl", "Node.js", "PHP"] as const).map(lang => <button type="button" key={lang} aria-pressed={language === lang} onClick={() => setLanguage(lang)} className={`rounded-lg px-4 py-2 ${language === lang ? "bg-green-500 text-white" : "border border-[var(--border-color)]"}`}>{lang}</button>)}</div>
      <Code>{examples[language]}</Code>
    </section>
    <section className={card}>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pricing, retries and limits</h2>
      <p>All amounts are NGN. API orders use reseller wholesale pricing, giving you room to add your own retail profit margin. The live API catalog is authoritative. The quoted price is reserved before the provider receives the purchase and is the total charged for that order. A lower provider cost does not change the accepted quote. Existing orders keep the price accepted when they were placed.</p>
      <p><strong>One Idempotency-Key per customer order.</strong> Use 8–128 letters, digits, dots, colons, underscores or hyphens. Save the key and request body before sending. If the connection drops, retry with exactly the same key and body. Successful retries return the original HTTP 201 response with <code>Idempotency-Replayed: true</code>; its balance is the original snapshot. Use /balance for current funds. A different body with the same key returns 409.</p>
      <p>If provisioning cannot be confirmed, <code>order_pending</code> includes a <code>request_id</code> and the reserved amount. Keep the original key. The reservation prevents a second purchase while the outcome is checked. Contact support with the request ID if the state persists. A confirmed rejection releases the reservation; use a new key only for a deliberately new order.</p>
      <p><strong>60 requests per minute per account</strong>, shared by all endpoints and keys. Responses include X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset (Unix seconds); 429 includes Retry-After. There is a limit of 10 active or pending USA rentals, including USA dashboard rentals. Stagger polling and back off to stay within your account limit.</p>
      <p>Confirmed expiry or cancellation without a code returns funds to your Temp Number wallet once. Receiving a code completes the order and does not refund it. Your platform must separately decide how to credit your own customer. Revoking a key stops future API authentication; existing orders remain in your account and can be accessed with a new key.</p>
      <p>For unresolved orders, email <a href="mailto:support@tempnumber.ng" className="text-green-500 hover:underline">support@tempnumber.ng</a> with your request ID. Never send your API key.</p>
    </section>
    {USA_API_ENDPOINTS.map(endpoint => <section key={endpoint.path} id={endpoint.path.slice(1)} className={card}>
      <div className="flex items-center gap-3"><span className="rounded bg-green-500/10 px-2 py-1 font-mono text-xs font-bold text-green-500">{endpoint.method}</span><code className="font-semibold text-[var(--text-primary)]">/api/v1{endpoint.path}</code></div>
      <h2 className="font-semibold text-[var(--text-primary)]">{endpoint.title}</h2>
      <p>{endpoint.description}</p>
      {endpoint.request && <><h3 className="text-xs font-semibold uppercase tracking-wide">JSON request</h3><Code>{JSON.stringify(endpoint.request, null, 2)}</Code></>}
      <h3 className="text-xs font-semibold uppercase tracking-wide">Example response</h3><Code>{JSON.stringify(endpoint.response, null, 2)}</Code>
    </section>)}
    <section className={card}>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">Errors</h2>
      <Code>{JSON.stringify({ error: "Top up your Temp Number wallet.", code: "insufficient_balance", price_ngn: 2000 }, null, 2)}</Code>
      <p>Use HTTP status and <code>code</code> in your integration; error text can change. Unknown routes and unsupported methods may return framework-level errors, so handle non-JSON responses too.</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-[var(--border-color)]"><th className="p-2">HTTP</th><th className="p-2">Code</th><th className="p-2">What to do</th></tr></thead><tbody>{USA_API_ERRORS.map(([status, code, action]) => <tr key={code} className="border-b border-[var(--border-color)]"><td className="p-2 align-top whitespace-nowrap">{status}</td><td className="p-2 align-top font-mono break-words">{code}</td><td className="p-2 align-top min-w-48">{action}</td></tr>)}</tbody></table></div>
    </section>
  </div>;
}
