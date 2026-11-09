import { NextResponse } from "next/server";
import { getAllServices, addService, deleteService, updateService } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = getAllServices();
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url, method = "GET", expectedCode = 200, timeoutMs = 5000, category = "Production API" } = body;

    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const service = addService({
      name,
      url,
      method,
      expectedCode: Number(expectedCode) || 200,
      timeoutMs: Number(timeoutMs) || 5000,
      category,
      isActive: true,
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to parse request" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const updated = updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update service" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
  }

  const success = deleteService(id);
  if (!success) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
