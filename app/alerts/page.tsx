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
    <div className="lg:ml-64 flex-1 max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Alerts</h1>
        <p className="text-gray-400">System alerts and incident notifications</p>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 backdrop-blur-sm p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-lg font-medium text-green-400 mb-2">All Clear</h3>
          <p className="text-gray-400">No alerts triggered. All systems are operating normally.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {alerts.length} active alert{alerts.length > 1 ? 's' : ''}
            </p>
            <button className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Dismiss All
            </button>
          </div>
          
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 backdrop-blur-sm p-6 group hover:border-red-500/50 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 flex-shrink-0">
                  <span className="text-red-400">🚨</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-red-400">API Down</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                      Critical
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">
                    API endpoint failed to respond within the expected timeframe.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>⏰ {new Date(alert.createdAt).toLocaleString()}</span>
                    <span>📍 API Monitor</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
