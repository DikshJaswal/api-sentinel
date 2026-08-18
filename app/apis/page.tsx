"use client";

import { useCallback, useEffect, useState } from "react";

export default function APIsPage() {
  const [status, setStatus] = useState<"UP" | "DOWN" | "UNKNOWN">("UNKNOWN");
  const [lastChecked, setLastChecked] = useState<string>("");
  const [checking, setChecking] = useState(false);

  const API_URL = "Demo API — generated dummy data";

  const load = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/monitor", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      setStatus(data.status);
      setLastChecked(new Date().toLocaleString());
    } catch {
      setStatus("DOWN");
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="lg:ml-64 flex-1 max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">APIs</h1>
        <p className="text-gray-400">Monitor and manage your API endpoints</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <span className="text-blue-400">🔗</span>
              </div>
              <p className="text-sm font-medium text-gray-400">Monitored API</p>
            </div>
            <p className="text-white font-medium break-all text-sm lg:text-base">
              {API_URL}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                status === "UP" 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                <div className={`h-2 w-2 rounded-full ${status === "UP" ? "bg-green-400" : "bg-red-400"} ${status === "UP" ? "animate-pulse" : ""}`} />
                {status}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Last checked: {lastChecked || "—"}
              </p>
            </div>
            
            <button onClick={load} disabled={checking} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-blue-500/25">
              {checking ? "Checking..." : "Check Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
