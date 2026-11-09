import { NextResponse } from "next/server";
import { getLogs } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId") || undefined;

  const logs = getLogs(serviceId, 1);
  return NextResponse.json(logs[0] || null);
}
