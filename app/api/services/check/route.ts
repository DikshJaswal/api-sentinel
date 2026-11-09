import { NextResponse } from "next/server";
import { getServiceById, pingService, pingAllServices, getAllServices } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id } = body;

    if (!id || id === "all") {
      await pingAllServices();
      const services = getAllServices();
      return NextResponse.json({ success: true, services });
    }

    const service = getServiceById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const result = await pingService(service);
    const updated = getServiceById(id);

    return NextResponse.json({ success: true, result, service: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Check execution failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
