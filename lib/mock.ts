import { getAllServices, getLogs, recordLog } from "./registry";
import { ServiceCheckLog } from "./types";

export type MockLog = {
  id: number;
  status: "UP" | "DOWN";
  responseTime: number | null;
  createdAt: Date;
};

export function isMockMode() {
  return process.env.USE_MOCK_DATA !== "false" || !process.env.DATABASE_URL;
}

export function getMockLogs(): MockLog[] {
  const logs = getLogs("all", 50);
  return logs.map((l, index) => ({
    id: index + 1,
    status: l.status,
    responseTime: l.responseTime,
    createdAt: new Date(l.createdAt),
  }));
}

export function addMockLog(): MockLog {
  const services = getAllServices();
  const randomService = services[Math.floor(Math.random() * services.length)] || {
    id: "srv-default",
    name: "RESOLVE Backend Health API",
  };

  const isUp = Math.random() > 0.08;
  const responseTime = isUp ? 90 + Math.floor(Math.random() * 220) : null;

  const log: ServiceCheckLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    serviceId: randomService.id,
    serviceName: randomService.name,
    status: isUp ? "UP" : "DOWN",
    statusCode: isUp ? 200 : 500,
    responseTime,
    errorMessage: isUp ? null : "Simulated downstream exception",
    createdAt: new Date().toISOString(),
  };

  recordLog(log);

  return {
    id: Date.now(),
    status: isUp ? "UP" : "DOWN",
    responseTime,
    createdAt: new Date(),
  };
}
