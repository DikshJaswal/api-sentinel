import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      { cache: "no-store" }
    );

    const responseTime = Date.now() - start;
    const status = response.ok ? "UP" : "DOWN";

    await prisma.apiLog.create({
      data: {
        status,
        responseTime,
      },
    });

    return NextResponse.json({ status, responseTime });
  } catch (error) {
    await prisma.apiLog.create({
      data: {
        status: "DOWN",
        responseTime: null,
      },
    });

    return NextResponse.json(
      { status: "DOWN", responseTime: null },
      { status: 500 }
    );
  }
}
