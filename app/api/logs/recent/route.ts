import { NextResponse } from "next/server";
import { getLogs } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId") || undefined;
  const limit = Number(searchParams.get("limit")) || 20;

  const logs = getLogs(serviceId, limit);
  return NextResponse.json(logs);
}
