import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const logs = await prisma.apiLog.findMany({
    orderBy: { createdAt: "desc" }, // get latest entries
    take: 10,
  });

  // IMPORTANT: return oldest → newest for charts
  return NextResponse.json(logs.reverse());
}
