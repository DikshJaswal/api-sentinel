"use client";

import { useEffect, useState } from "react";

export default function APIsPage() {
  const [status, setStatus] = useState<"UP" | "DOWN" | "UNKNOWN">("UNKNOWN");
  const [lastChecked, setLastChecked] = useState<string>("");

  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/monitor", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setStatus(data.status);
        setLastChecked(new Date().toLocaleString());
      } catch {
        setStatus("DOWN");
      }
    }

    load();
  }, []);

  return (
    <div className="ml-64 p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-6">
        APIs
      </h1>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Monitored API</p>
          <p className="text-white font-medium break-all">
            {API_URL}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`font-bold ${
              status === "UP" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status}
          </p>
          <p className="text-xs text-gray-400">
            Last checked: {lastChecked || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
