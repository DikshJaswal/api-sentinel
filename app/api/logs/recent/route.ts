import { NextResponse } from "next/server";
import { getMockLogs, isMockMode } from "@/lib/mock";

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json(getMockLogs().slice(-10));
  }

  const { prisma } = await import("@/lib/prisma");

  const logs = await prisma.apiLog.findMany({
    orderBy: { createdAt: "desc" }, // get latest entries
    take: 10,
  });

  // IMPORTANT: return oldest → newest for charts
  return NextResponse.json(logs.reverse());
}
