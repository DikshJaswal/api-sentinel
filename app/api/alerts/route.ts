import { NextResponse } from "next/server";
import { getAlertHistory } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const alerts = getAlertHistory();
  return NextResponse.json({ alerts });
}
