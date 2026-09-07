export const USA_API_ENDPOINTS = [
  {
    method: "GET", path: "/balance", title: "Wallet balance",
    description: "Available funds in your Temp Number wallet. Reservations for pending orders are already deducted. Top up in the dashboard before purchasing.",
    request: null,
    response: { balance_ngn: 15000, currency: "NGN" },
  },
  {
    method: "GET", path: "/prices", title: "USA services and live prices",
    description: "Use api_name as the service when ordering. price_ngn is your purchase price in Naira; stock can change before you order. ttl is the rental duration in minutes. Only USA short-term services are returned.",
    request: null,
    response: [{ api_name: "whatsapp", service_name: "WhatsApp", country: "USA", currency: "NGN", price_ngn: 2000, stock: 12, ttl: 20, multiple_sms: false }],
  },
  {
    method: "POST", path: "/rent", title: "Order a USA number",
    description: "Requires Idempotency-Key. service is required; max_price_ngn is an optional spending cap in NGN. The server checks current stock and pricing, reserves your funds, then provisions the number. Other fields, including country, provider and USD max_price, are rejected. Returns HTTP 201 on success.",
    request: { service: "whatsapp", max_price_ngn: 2000 },
    response: { id: 12345, number: "+12025550123", service_name: "WhatsApp", country: "USA", price_ngn: 2000, currency: "NGN", status: "active", code: null, end_time: "2026-09-06T12:20:00Z", new_balance: 13000, request_id: "81" },
  },
  {
    method: "POST", path: "/status", title: "Receive the SMS code",
    description: "Use the id returned by /rent or /rentals. Poll every 10 seconds, slowing down when you have several active rentals. Stop at completed, cancelled or expired. Codes are strings, preserving leading zeros. A provider outage returns 502; it does not imply expiry or a refund.",
    request: { id: 12345 },
    response: { id: 12345, number: "+12025550123", service_name: "WhatsApp", country: "USA", status: "completed", code: "012345", end_time: "2026-09-06T12:20:00Z", price_ngn: 2000, currency: "NGN", rented_at: "2026-09-06 12:00:00", refunded: false, refund_ngn: 0, new_balance: 13000 },
  },
  {
    method: "POST", path: "/cancel", title: "Cancel and check the outcome",
    description: "Requests cancellation from the provider. Only a confirmed cancellation or expiry without an SMS credits the wallet. The response can remain active if cancellation is not yet confirmed, or become completed if an SMS arrived. Repeating a terminal cancellation does not refund again. refunded describes a credit made by this request, not the rental's entire refund history.",
    request: { id: 12345 },
    response: { id: 12345, number: "+12025550123", service_name: "WhatsApp", country: "USA", status: "cancelled", code: null, end_time: "2026-09-06T12:20:00Z", price_ngn: 2000, currency: "NGN", rented_at: "2026-09-06 12:00:00", refunded: true, refund_ngn: 2000, new_balance: 15000 },
  },
  {
    method: "GET", path: "/rentals", title: "USA rental history",
    description: "Returns your USA short-term rentals, including dashboard purchases, newest first. Global, dedicated and long-term numbers are excluded. Optional query parameters: limit (1–100, default 50) and before (the previous next_cursor). Continue until next_cursor is null. The cursor is a pagination token; use each rental's id for status and cancellation.",
    request: null,
    response: { data: [{ id: 12345, number: "+12025550123", service_name: "WhatsApp", country: "USA", status: "completed", code: "012345", end_time: "2026-09-06T12:20:00Z", price_ngn: 2000, currency: "NGN", rented_at: "2026-09-06 12:00:00" }], next_cursor: null },
  },
] as const;

export const USA_API_ERRORS = [
  ["400", "invalid_request / invalid_json / idempotency_required", "Correct the body or headers. Only documented fields are accepted."],
  ["401", "invalid_api_key", "Check X-API-Key. Generate a new key if yours was revoked."],
  ["403", "account_disabled", "Contact support about your account."],
  ["402", "insufficient_balance", "Top up your wallet before ordering."],
  ["404", "service_not_found / rental_not_found", "Use a listed USA service and a rental belonging to your account."],
  ["409", "out_of_stock / price_exceeded / active_limit", "Refresh prices, adjust your cap, or wait for active orders to finish."],
  ["409", "idempotency_conflict", "The same key was sent with different input. Restore the original body for a retry."],
  ["409", "order_pending", "Keep the same key and body. Funds remain reserved. Contact support with request_id if it persists; do not place a replacement order."],
  ["409", "order_rejected", "No number was supplied and the reservation was released. A new attempt requires a new order key."],
  ["413 / 415", "request_too_large / invalid_content_type", "Send an application/json object no larger than 8 KB."],
  ["429", "rate_limited", "Wait for Retry-After seconds; use backoff and stagger polling."],
  ["502 / 503", "provider_unavailable / api_unavailable", "Retry with backoff. For purchases, always reuse the original key and body."],
] as const;
