import { NextRequest } from "next/server";
import { proxyUsaApi } from "@/lib/usa-api-proxy";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) { return proxyUsaApi(req, "status"); }
