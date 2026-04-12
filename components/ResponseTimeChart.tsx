"use client";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "@/lib/chart";

interface Log {
  responseTime: number | null;
  createdAt: string;
}

export default function ResponseTimeChart() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/logs/recent", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: Log[] = await res.json();

        if (mounted && Array.isArray(data)) {
          // backend already returns last 10 in correct order
          setLogs(data);
        }
      } catch (err) {
        console.error("Chart fetch failed", err);
      }
    }

    load();
    const interval = setInterval(load, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const chartData = {
    labels: logs.map((l) =>
      new Date(l.createdAt).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Response Time (ms)",
        data: logs.map((l) => l.responseTime ?? 0),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: "#0ea5e9",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Response Time Trend
          </h3>
          <p className="text-sm text-gray-400 mt-1">Live monitoring - updates every 5 seconds</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      <div className="relative h-[320px] w-full">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>Average response time: {logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + (l.responseTime || 0), 0) / logs.length) : 0}ms</span>
        <span>Data points: {logs.length}</span>
      </div>
    </div>
  );
}
