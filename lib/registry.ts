import { MonitoredService, ServiceCheckLog } from "./types";
import { dispatchIncidentAlert } from "./notifications";

// Initial Registry pre-populated with our real production applications
const defaultServices: MonitoredService[] = [
  {
    id: "srv-resolve-api",
    name: "RESOLVE Backend Health API",
    url: "https://resolve-api-7q6z.onrender.com/api/health",
    method: "GET",
    expectedCode: 200,
    timeoutMs: 6000,
    category: "Production API",
    isActive: true,
    lastStatus: "UP",
    lastChecked: new Date().toISOString(),
    lastLatency: 185,
    uptimeScore: 99.8,
    totalChecks: 240,
    failedChecks: 1,
  },
  {
    id: "srv-resolve-web",
    name: "RESOLVE Web App (Client)",
    url: "https://resolve-pink-eight.vercel.app/",
    method: "GET",
    expectedCode: 200,
    timeoutMs: 5000,
    category: "Frontend App",
    isActive: true,
    lastStatus: "UP",
    lastChecked: new Date().toISOString(),
    lastLatency: 110,
    uptimeScore: 100.0,
    totalChecks: 240,
    failedChecks: 0,
  },
  {
    id: "srv-codeflow",
    name: "CodeFlow JS Debugger",
    url: "https://codeflow-javascript-debugger.vercel.app/",
    method: "GET",
    expectedCode: 200,
    timeoutMs: 5000,
    category: "Frontend App",
    isActive: true,
    lastStatus: "UP",
    lastChecked: new Date().toISOString(),
    lastLatency: 95,
    uptimeScore: 99.9,
    totalChecks: 240,
    failedChecks: 0,
  },
  {
    id: "srv-finpilot",
    name: "FinPilot Financial Core API",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    expectedCode: 200,
    timeoutMs: 5000,
    category: "Microservice",
    isActive: true,
    lastStatus: "UP",
    lastChecked: new Date().toISOString(),
    lastLatency: 145,
    uptimeScore: 99.5,
    totalChecks: 240,
    failedChecks: 1,
  },
];

// Persistent across serverless warm invokes
const servicesStore: MonitoredService[] = [...defaultServices];

// In-memory logs store (stores up to 200 recent check events)
const logsStore: ServiceCheckLog[] = Array.from({ length: 15 }, (_, i) => {
  const service = defaultServices[i % defaultServices.length];
  const isUp = i !== 4;
  return {
    id: `log-seed-${i}`,
    serviceId: service.id,
    serviceName: service.name,
    status: isUp ? "UP" : "DOWN",
    statusCode: isUp ? 200 : 503,
    responseTime: isUp ? 90 + ((i * 37) % 180) : null,
    errorMessage: isUp ? null : "Upstream 503 Service Unavailable",
    createdAt: new Date(Date.now() - (15 - i) * 60_000).toISOString(),
  };
});

export function getAllServices(): MonitoredService[] {
  return [...servicesStore];
}

export function getServiceById(id: string): MonitoredService | undefined {
  return servicesStore.find((s) => s.id === id);
}

export function addService(
  input: Omit<MonitoredService, "id" | "lastStatus" | "lastChecked" | "lastLatency" | "uptimeScore" | "totalChecks" | "failedChecks">
): MonitoredService {
  const newService: MonitoredService = {
    ...input,
    id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    lastStatus: "UNKNOWN",
    lastChecked: null,
    lastLatency: null,
    uptimeScore: 100.0,
    totalChecks: 0,
    failedChecks: 0,
  };
  servicesStore.push(newService);
  return newService;
}

export function updateService(
  id: string,
  updates: Partial<MonitoredService>
): MonitoredService | null {
  const index = servicesStore.findIndex((s) => s.id === id);
  if (index === -1) return null;
  servicesStore[index] = { ...servicesStore[index], ...updates };
  return servicesStore[index];
}

export function deleteService(id: string): boolean {
  const index = servicesStore.findIndex((s) => s.id === id);
  if (index === -1) return false;
  servicesStore.splice(index, 1);
  return true;
}

export function getLogs(serviceId?: string, limit = 50): ServiceCheckLog[] {
  let filtered = logsStore;
  if (serviceId && serviceId !== "all") {
    filtered = filtered.filter((l) => l.serviceId === serviceId);
  }
  return [...filtered]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-limit);
}

export function recordLog(log: ServiceCheckLog): void {
  logsStore.push(log);
  if (logsStore.length > 200) {
    logsStore.shift();
  }
}

/**
 * Ping an individual service, measure latency, evaluate health, and trigger alerts on status flips.
 */
export async function pingService(service: MonitoredService): Promise<{
  status: "UP" | "DOWN";
  statusCode: number | null;
  responseTime: number | null;
  errorMessage?: string;
}> {
  const previousStatus = service.lastStatus;
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), service.timeoutMs || 5000);

    const response = await fetch(service.url, {
      method: service.method || "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "APISentinel-HealthChecker/2.0 (+https://api-sentinel-psi.vercel.app)",
        Accept: "*/*",
      },
    });

    clearTimeout(timeoutId);

    const responseTime = Date.now() - start;
    const isUp = response.status === service.expectedCode || (response.status >= 200 && response.status < 300);
    const status: "UP" | "DOWN" = isUp ? "UP" : "DOWN";

    const log: ServiceCheckLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      serviceId: service.id,
      serviceName: service.name,
      status,
      statusCode: response.status,
      responseTime,
      errorMessage: isUp ? null : `Expected HTTP ${service.expectedCode}, received ${response.status}`,
      createdAt: new Date().toISOString(),
    };

    recordLog(log);

    // Update service metrics
    const totalChecks = service.totalChecks + 1;
    const failedChecks = isUp ? service.failedChecks : service.failedChecks + 1;
    const uptimeScore = Number((((totalChecks - failedChecks) / totalChecks) * 100).toFixed(1));

    updateService(service.id, {
      lastStatus: status,
      lastLatency: responseTime,
      lastChecked: new Date().toISOString(),
      totalChecks,
      failedChecks,
      uptimeScore,
    });

    // Check if status changed to trigger alerts
    if (status === "DOWN" && previousStatus !== "DOWN") {
      await dispatchIncidentAlert({
        serviceId: service.id,
        serviceName: service.name,
        serviceUrl: service.url,
        type: "OUTAGE",
        statusCode: response.status,
        responseTime,
        errorMessage: `Service returned HTTP ${response.status}`,
      });
    } else if (status === "UP" && previousStatus === "DOWN") {
      await dispatchIncidentAlert({
        serviceId: service.id,
        serviceName: service.name,
        serviceUrl: service.url,
        type: "RECOVERY",
        statusCode: response.status,
        responseTime,
      });
    }

    return { status, statusCode: response.status, responseTime };
  } catch (err: unknown) {
    const responseTime = null;
    const errorMsg = err instanceof Error ? err.message : "Network/Connection Failure";

    const log: ServiceCheckLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      serviceId: service.id,
      serviceName: service.name,
      status: "DOWN",
      statusCode: null,
      responseTime: null,
      errorMessage: errorMsg,
      createdAt: new Date().toISOString(),
    };

    recordLog(log);

    const totalChecks = service.totalChecks + 1;
    const failedChecks = service.failedChecks + 1;
    const uptimeScore = Number((((totalChecks - failedChecks) / totalChecks) * 100).toFixed(1));

    updateService(service.id, {
      lastStatus: "DOWN",
      lastLatency: null,
      lastChecked: new Date().toISOString(),
      totalChecks,
      failedChecks,
      uptimeScore,
    });

    if (previousStatus !== "DOWN") {
      await dispatchIncidentAlert({
        serviceId: service.id,
        serviceName: service.name,
        serviceUrl: service.url,
        type: "OUTAGE",
        statusCode: null,
        errorMessage: errorMsg,
      });
    }

    return { status: "DOWN", statusCode: null, responseTime, errorMessage: errorMsg };
  }
}

/**
 * Ping all active services simultaneously
 */
export async function pingAllServices(): Promise<Array<{ service: MonitoredService; result: unknown }>> {
  const activeServices = servicesStore.filter((s) => s.isActive);
  const results = await Promise.allSettled(activeServices.map((s) => pingService(s)));

  return activeServices.map((service, index) => ({
    service,
    result: results[index],
  }));
}
