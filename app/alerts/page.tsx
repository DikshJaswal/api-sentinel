"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: number;
  status: "UP" | "DOWN";
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await fetch("/api/logs/recent", { cache: "no-store" });
      const data = await res.json();

      // show only DOWN events
      setAlerts(data.filter((l: Alert) => l.status === "DOWN"));
    }

    loadAlerts();
  }, []);

  return (
    <div className="ml-64 p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-6">
        Alerts
      </h1>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-400">
          No alerts triggered.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
            >
              🔴 API DOWN at{" "}
              {new Date(alert.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
