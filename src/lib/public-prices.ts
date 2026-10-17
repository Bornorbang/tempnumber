import "server-only";
import { unstable_cache } from "next/cache";

type Service = { service_name: string; api_name: string; price: string; ttl: number; stock: number; multiple_sms: string };
type Product = { name: string; Category: string; Qty: number; Price: number };

// Cache successful snapshots only. A failed revalidation leaves the previous
// successful snapshot in Next's persistent Data Cache.
export const publicUsaPrices = unstable_cache(async () => {
  const key = process.env.GETATEXT_API_KEY;
  if (!key) throw new Error("USA pricing is not configured");
  const response = await fetch(`${process.env.GETATEXT_BASE_URL ?? "https://getatext.com"}/api/v1/prices-info`, {
    headers: { Auth: key, Accept: "application/json" },
    cache: "no-store", signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("USA pricing unavailable");
  const data = await response.json();
  const rows = Array.isArray(data) ? data : Array.isArray(data.prices) ? data.prices : data.service_name ? [data] : null;
  if (!rows || data.errors) throw new Error("Invalid USA pricing response");
  const items: Service[] = rows.filter((row: Service) => typeof row.service_name === "string" && typeof row.api_name === "string" && Number.isFinite(Number(row.price)) && Number(row.price) >= 0)
    .map((row: Service) => ({ service_name: row.service_name, api_name: row.api_name, price: String(row.price), ttl: Number(row.ttl) || 0, stock: Number(row.stock) || 0, multiple_sms: String(row.multiple_sms) }));
  if (rows.length && !items.length) throw new Error("Invalid USA prices");
  return { items, fetchedAt: Date.now() };
}, ["public-usa-pricing-v1"], { revalidate: 300 });

export const publicGlobalPrices = unstable_cache(async () => {
  const response = await fetch("https://5sim.net/v1/guest/products/england/any", {
    headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Global pricing unavailable");
  const data = await response.json();
  if (!data || typeof data !== "object" || Array.isArray(data) || data.error) throw new Error("Invalid global prices");
  const items: Product[] = Object.entries(data as Record<string, Omit<Product, "name">>)
    .filter(([, row]) => row && row.Category === "activation" && Number.isFinite(row.Price) && row.Price >= 0)
    .map(([name, row]) => ({ name, Category: row.Category, Qty: row.Qty, Price: row.Price }))
    .sort((a, b) => Number(b.Qty > 0) - Number(a.Qty > 0) || a.Price - b.Price);
  if (Object.keys(data).length && !items.length) throw new Error("Invalid global prices");
  return { items, fetchedAt: Date.now() };
}, ["public-global-pricing-v1"], { revalidate: 300 });
