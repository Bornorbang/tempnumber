import PricingTables from "./PricingTables";
import { publicUsaPrices, publicGlobalPrices } from "@/lib/public-prices";

export const revalidate = 300;

export default async function PricingPage() {
  const [usa, global] = await Promise.allSettled([publicUsaPrices(), publicGlobalPrices()]);
  // Server-only freshness check for the cached provider snapshot.
  // eslint-disable-next-line react-hooks/purity -- server render has no client state
  const timestamp = Date.now() - 300_000;
  return <PricingTables
    initialServices={usa.status === "fulfilled" ? usa.value.items : []}
    initialGlobalProducts={global.status === "fulfilled" ? global.value.items : []}
    usaUnavailable={usa.status === "rejected"}
    globalUnavailable={global.status === "rejected"}
    stale={(usa.status === "fulfilled" && usa.value.fetchedAt < timestamp) || (global.status === "fulfilled" && global.value.fetchedAt < timestamp)}
  />;
}
