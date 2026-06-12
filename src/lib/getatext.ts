/**
 * Server-side helper for Getatext API.
 * NEVER import this in client components — it uses server-only env vars.
 */

const API_KEY = process.env.GETATEXT_API_KEY ?? "";
const BASE_URL = process.env.GETATEXT_BASE_URL ?? "https://getatext.com";

/** Naira per USD conversion rate (update as needed) */
export const NGN_RATE = 1600;

export function usdToNgn(usd: number | string): number {
  return Math.ceil(Number(usd) * NGN_RATE) + 700;
}

export async function getatextFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Auth: API_KEY,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
