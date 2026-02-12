"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ResponseTimeChart from "@/components/ResponseTimeChart";

interface Log {
  status: "UP" | "DOWN";
  responseTime: number | null;
  createdAt: string;
}

//  SAFE JSON PARSER (VERY IMPORTANT)
async function safeJson(res: Response) {
  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [status, setStatus] = useState("...");
  const [responseTime, setResponseTime] = useState("0 ms");
  const [logs, setLogs] = useState<Log[]>([]);

  // Derived analytics
  const upCount = logs.filter((l) => l.status === "UP").length;
  const downCount = logs.filter((l) => l.status === "DOWN").length;

  const totalChecks = upCount + downCount;
  const healthScore = totalChecks
    ? Math.round((upCount / totalChecks) * 100)
    : 100;

  const healthLabel =
    healthScore >= 95
      ? "Excellent"
      : healthScore >= 80
      ? "Good"
      : "Degraded";

  const rt = parseInt(responseTime);
  const rtLabel =
    rt < 500 ? "Fast" : rt <= 1000 ? "Moderate" : "Slow";

  // Auto monitoring + polling
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        // Trigger monitoring (DB insert happens here)
        const monitorRes = await fetch("/api/monitor");
        const monitorData = await safeJson(monitorRes);

        if (mounted && monitorData) {
          setStatus(monitorData.status);
          setResponseTime(`${monitorData.responseTime} ms`);
        }

        // Fetch recent logs
        const logsRes = await fetch("/api/logs/recent");
        const logsData = await safeJson(logsRes);

        if (mounted && Array.isArray(logsData)) {
          setLogs(logsData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15000); // every 15 sec

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ----UI---
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="ml-64 flex-1 max-w-7xl px-8 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p
          className={`mt-1 font-semibold ${
            status === "UP" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status}
        </p>

        {/* Alert Banner */}
        {downCount > 0 && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400">
            ⚠️ API failures detected. Please check system health.
          </div>
        )}

        {/* Stat Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <StatCard
            title="API Status"
            value={status}
            accent={status === "UP" ? "green" : "red"}
          />

          <StatCard title="Monitored APIs" value="1" />

          <StatCard
            title="Response Time"
            value={`${responseTime} (${rtLabel})`}
            accent={rt < 500 ? "green" : rt <= 1000 ? "blue" : "red"}
          />

          <StatCard
            title="APIs UP (last 10)"
            value={upCount.toString()}
            accent="green"
          />

          <StatCard
            title="APIs DOWN (last 10)"
            value={downCount.toString()}
            accent="red"
          />
        </div>

        {/* Health Score */}
        <div className="mt-6 max-w-sm">
          <StatCard
            title="Health Score (SLA)"
            value={`${healthScore}% (${healthLabel})`}
            accent={
              healthScore >= 95
                ? "green"
                : healthScore >= 80
                ? "blue"
                : "red"
            }
          />
        </div>

        {/* Chart */}
        <div className="mt-10">
          <ResponseTimeChart />
        </div>

        {/* Recent Events */}
        <div className="mt-8 max-w-3xl rounded-xl bg-white/5 border border-white/10 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Events
          </h3>

          <ul className="space-y-3 text-sm">
            {logs.slice(-5).reverse().map((log, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-300"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    log.status === "UP"
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-gray-400">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
                —
                <span className="font-medium">
                  API {log.status}
                  {log.responseTime !== null &&
                    ` (${log.responseTime} ms)`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
