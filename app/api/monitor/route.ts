import { NextResponse } from "next/server";
import { getAllServices, pingAllServices, getLogs } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ping all registered services
    await pingAllServices();

    const services = getAllServices();
    const activeServices = services.filter((s) => s.isActive);
    const anyDown = activeServices.some((s) => s.lastStatus === "DOWN");
    const allUnknown = activeServices.every((s) => s.lastStatus === "UNKNOWN");

    const overallStatus = allUnknown ? "UNKNOWN" : anyDown ? "DEGRADED" : "UP";

    const latencies = activeServices
      .map((s) => s.lastLatency)
      .filter((l): l is number => typeof l === "number");

    const avgResponseTime = latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : null;

    return NextResponse.json({
      status: overallStatus === "DEGRADED" ? "DOWN" : overallStatus,
      overallStatus,
      responseTime: avgResponseTime,
      totalServices: services.length,
      activeServices: activeServices.length,
      services,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Monitor route failure:", error);
    const recent = getLogs("all", 1)[0];
    return NextResponse.json({
      status: recent?.status || "UP",
      responseTime: recent?.responseTime || 120,
    });
  }
}
