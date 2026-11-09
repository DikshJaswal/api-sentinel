export type ServiceCategory = "Production API" | "Frontend App" | "Microservice" | "Third-Party";

export type ServiceStatus = "UP" | "DOWN" | "DEGRADED" | "UNKNOWN";

export interface MonitoredService {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "HEAD";
  expectedCode: number;
  timeoutMs: number;
  category: ServiceCategory;
  isActive: boolean;
  lastStatus: ServiceStatus;
  lastChecked: string | null;
  lastLatency: number | null;
  uptimeScore: number; // percentage, e.g. 99.8
  totalChecks: number;
  failedChecks: number;
}

export interface ServiceCheckLog {
  id: string;
  serviceId: string;
  serviceName: string;
  status: "UP" | "DOWN";
  statusCode: number | null;
  responseTime: number | null;
  errorMessage?: string | null;
  createdAt: string;
}

export type AlertChannel = "TWILIO_SENDGRID" | "TWILIO_SMS" | "DISCORD_WEBHOOK" | "SIMULATED_LOG";

export type AlertType = "OUTAGE" | "RECOVERY" | "TEST";

export type AlertDeliveryStatus = "DELIVERED" | "SIMULATED" | "FAILED";

export interface IncidentAlert {
  id: string;
  serviceId?: string | null;
  serviceName: string;
  type: AlertType;
  channel: AlertChannel;
  recipient: string;
  status: AlertDeliveryStatus;
  message: string;
  details?: {
    statusCode?: number | null;
    responseTime?: number | null;
    url?: string;
  };
  createdAt: string;
}
