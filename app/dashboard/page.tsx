"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ResponseTimeChart from "@/components/ResponseTimeChart";
import { MonitoredService, ServiceCheckLog } from "@/lib/types";

export default function Dashboard() {
  const [services, setServices] = useState<MonitoredService[]>([]);
  const [logs, setLogs] = useState<ServiceCheckLog[]>([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [servicesRes, logsRes] = await Promise.all([
        fetch("/api/services", { cache: "no-store" }),
        fetch("/api/logs/recent?limit=15", { cache: "no-store" }),
      ]);

      if (servicesRes.ok) {
        const { services: data } = await servicesRes.json();
        if (Array.isArray(data)) setServices(data);
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        if (Array.isArray(data)) setLogs(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000); // 15s auto-poll
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Ping a single service on demand
  const handlePingSingle = async (serviceId: string) => {
    setPingingId(serviceId);
    try {
      const res = await fetch("/api/services/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: serviceId }),
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Single ping failed:", err);
    } finally {
      setPingingId(null);
    }
  };

  // Ping all services
  const handlePingAll = async () => {
    setIsCheckingAll(true);
    try {
      const res = await fetch("/api/services/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "all" }),
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Check all failed:", err);
    } finally {
      setIsCheckingAll(false);
    }
  };

  // Derived aggregates
  const activeServices = services.filter((s) => s.isActive);
  const downServices = activeServices.filter((s) => s.lastStatus === "DOWN");
  const isHealthy = downServices.length === 0;

  const validLatencies = activeServices
    .map((s) => s.lastLatency)
    .filter((l): l is number => typeof l === "number");

  const avgLatency = validLatencies.length
    ? Math.round(validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length)
    : 0;

  const overallUptime = activeServices.length
    ? (activeServices.reduce((acc, s) => acc + s.uptimeScore, 0) / activeServices.length).toFixed(1)
    : "100.0";

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="relative z-10 w-full flex-1 px-4 pb-14 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                  Synthetic Health Telemetry
                </p>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                System Overview
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Continuous uptime, latency distribution, and incident alerts across production apps.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePingAll}
                disabled={isCheckingAll}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <svg
                  className={`h-4 w-4 ${isCheckingAll ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isCheckingAll ? "Pinging Services..." : "Check All Services"}
              </button>

              <Link
                href="/apis"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:border-blue-400/50 hover:bg-white/10 hover:text-white"
              >
                + Manage APIs
              </Link>
            </div>
          </header>

          {/* System Status Banner */}
          <div
            className={`mb-8 rounded-2xl border p-4 backdrop-blur-xl sm:p-5 transition-all ${
              isHealthy
                ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                : "border-red-500/30 bg-red-500/[0.08]"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-lg ${
                    isHealthy
                      ? "bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20"
                      : "bg-red-500/20 text-red-400 shadow-red-500/20"
                  }`}
                >
                  {isHealthy ? "✓" : "!"}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {isHealthy
                      ? "All Production Systems Operational"
                      : `${downServices.length} Service Outage Detected`}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {isHealthy
                      ? "RESOLVE, CodeFlow, and integrated APIs are responding within acceptable latency thresholds."
                      : "Outage detected. Automated incident dispatch triggered."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Alert Dispatch:</span>
                <span className="rounded-full bg-blue-500/10 border border-blue-400/30 px-2.5 py-1 text-[11px] font-bold text-blue-300">
                  Twilio SendGrid / SMS
                </span>
              </div>
            </div>
          </div>

          {/* Core Analytics Cards */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Monitored Services"
              value={services.length.toString()}
              accent="blue"
              trend={{ value: 100, isPositive: true }}
            />
            <StatCard
              title="System SLA Uptime"
              value={`${overallUptime}%`}
              accent="green"
              trend={{ value: 99.9, isPositive: true }}
            />
            <StatCard
              title="Avg Response Latency"
              value={`${avgLatency} ms`}
              accent="purple"
            />
            <StatCard
              title="Active Incidents"
              value={downServices.length.toString()}
              accent={downServices.length > 0 ? "red" : "cyan"}
            />
          </section>

          {/* Monitored Services Grid */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Production Target Endpoints</h2>
                <p className="text-xs text-gray-400">Individual health status and direct latency audits</p>
              </div>
              <span className="text-xs text-gray-400">Showing {services.length} targets</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => {
                const isUp = service.lastStatus === "UP";
                const isPinging = pingingId === service.id;

                return (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 backdrop-blur-xl shadow-xl transition hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-lg bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          {service.category}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isUp
                              ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-300"
                              : "bg-red-500/10 border border-red-400/30 text-red-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isUp ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {service.lastStatus}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold text-white text-sm line-clamp-1">
                        {service.name}
                      </h3>

                      <a
                        href={service.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-xs text-blue-400 hover:underline truncate"
                        title={service.url}
                      >
                        {service.url}
                      </a>

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">Latency</p>
                          <p className="mt-0.5 font-bold text-white">
                            {service.lastLatency !== null ? `${service.lastLatency} ms` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">SLA Uptime</p>
                          <p className="mt-0.5 font-bold text-emerald-300">
                            {service.uptimeScore}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[10px] text-gray-400">
                        {service.lastChecked
                          ? new Date(service.lastChecked).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Never"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePingSingle(service.id)}
                        disabled={isPinging}
                        className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-200 transition hover:bg-blue-600 hover:text-white disabled:opacity-50"
                      >
                        {isPinging ? "Pinging..." : "Ping Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Response Time Chart */}
          <section className="mb-8">
            <ResponseTimeChart services={services} />
          </section>

          {/* Recent Check Logs Table */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Recent Check Audit Stream</h3>
                <p className="text-xs text-gray-400">Real-time log of HTTP status probes</p>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">
                {logs.length} events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">HTTP Code</th>
                    <th className="pb-3 font-semibold">Response Time</th>
                    <th className="pb-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.slice().reverse().map((log) => {
                    const isUp = log.status === "UP";
                    return (
                      <tr key={log.id} className="transition hover:bg-white/[0.02]">
                        <td className="py-3 font-medium text-white">{log.serviceName}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
                              isUp
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-red-500/10 text-red-300"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isUp ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-gray-300">
                          {log.statusCode ?? "Timeout"}
                        </td>
                        <td className="py-3 font-mono text-gray-300">
                          {log.responseTime !== null ? `${log.responseTime} ms` : "—"}
                        </td>
                        <td className="py-3 text-right text-gray-400">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
