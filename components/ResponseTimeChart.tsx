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
    <div className="rounded-2xl bg-[#020617] p-6 border border-white/10 shadow-2xl">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Response Time Trend (Live)
      </h3>

      <div className="relative h-[320px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
