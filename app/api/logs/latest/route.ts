import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMockLogs, isMockMode } from "@/lib/mock";

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json(getMockLogs().at(-1) ?? null);
  }

  const log = await prisma.apiLog.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(log);
}
