import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const log = await prisma.apiLog.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(log);
}
