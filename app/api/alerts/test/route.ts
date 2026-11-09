import { NextResponse } from "next/server";
import { dispatchIncidentAlert } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { targetEmail, targetPhone, serviceName = "Demo Ping Test" } = body;

    const alert = await dispatchIncidentAlert({
      serviceName,
      serviceUrl: "https://api-sentinel-psi.vercel.app/",
      type: "TEST",
      statusCode: 200,
      responseTime: 85,
      targetEmail,
      targetPhone,
    });

    return NextResponse.json({ success: true, alert });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Test alert failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
