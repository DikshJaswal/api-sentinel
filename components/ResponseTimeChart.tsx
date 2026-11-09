"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useState, useCallback } from "react";
import "@/lib/chart";
import { MonitoredService, ServiceCheckLog } from "@/lib/types";

interface Props {
  services: MonitoredService[];
}

export default function ResponseTimeChart({ services }: Props) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [logs, setLogs] = useState<ServiceCheckLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogs = useCallback(async () => {
    try {
      const url =
        selectedServiceId === "all"
          ? "/api/logs/recent?limit=20"
          : `/api/logs/recent?serviceId=${selectedServiceId}&limit=20`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;

      const data: ServiceCheckLog[] = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch latency data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const labels = logs.map((l) => {
    const d = new Date(l.createdAt);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  });

  const chartData = {
    labels: labels.length ? labels : ["No data"],
    datasets: [
      {
        label: "Latency (ms)",
        data: logs.map((l) => l.responseTime ?? 0),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.15)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#0284c7",
        pointBorderColor: "#38bdf8",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f8fafc",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: { parsed: { y: number | null } }) => `Response Time: ${context.parsed.y ?? 0} ms`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          maxRotation: 0,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (value: number | string) => `${value}ms`,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
        },
      },
    },
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-6 backdrop-blur-xl shadow-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Response Time Trend</h3>
            <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
              Real-Time
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Synthetic HTTP latency distribution (ms) across monitored targets</p>
        </div>

        {/* Service Selector Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="service-select" className="text-xs text-gray-400 whitespace-nowrap">Filter Target:</label>
          <select
            id="service-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="rounded-xl border border-white/10 bg-gray-900/80 px-3 py-1.5 text-xs font-medium text-gray-200 outline-none transition focus:border-blue-400"
          >
            <option value="all">All Services Aggregated</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-64 w-full">
        {loading && logs.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500 animate-pulse">
            Loading telemetry data...
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
