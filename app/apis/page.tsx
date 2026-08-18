"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

type Status = "UP" | "DOWN" | "UNKNOWN";

export default function APIsPage() {
  const [status, setStatus] = useState<Status>("UNKNOWN");
  const [lastChecked, setLastChecked] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  const checkApi = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/monitor", { cache: "no-store" });
      const data = await response.json();
      setStatus(data.status ?? "DOWN");
      setResponseTime(data.responseTime ?? null);
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      setStatus("DOWN");
      setResponseTime(null);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkApi();
  }, [checkApi]);

  const isUp = status === "UP";
  const statusText = status === "UNKNOWN" ? "Not checked" : status;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="relative z-10 w-full flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">API monitoring</p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Your APIs</h1>
              <p className="mt-3 max-w-2xl text-gray-400">Monitor availability, speed, and the latest health check from one place.</p>
            </div>
            <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white">
              <span className="text-lg">←</span> Dashboard
            </Link>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Monitored APIs</p>
              <p className="mt-3 text-3xl font-black text-white">1</p>
              <p className="mt-1 text-sm text-gray-400">Demo endpoint</p>
            </div>
            <div className={`rounded-2xl border p-5 ${isUp ? "border-emerald-400/25 bg-emerald-500/[0.08]" : "border-red-400/25 bg-red-500/[0.08]"}`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Current status</p>
              <p className={`mt-3 text-3xl font-black ${isUp ? "text-emerald-300" : "text-red-300"}`}>{statusText}</p>
              <p className="mt-1 text-sm text-gray-400">Live demo result</p>
            </div>
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Response time</p>
              <p className="mt-3 text-3xl font-black text-white">{responseTime === null ? "N/A" : `${responseTime} ms`}</p>
              <p className="mt-1 text-sm text-gray-400">Latest check</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Last checked</p>
              <p className="mt-3 text-2xl font-black text-white">{lastChecked || "—"}</p>
              <p className="mt-1 text-sm text-gray-400">Just now updates here</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.03] p-6 shadow-2xl shadow-blue-950/20 sm:p-8">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl text-blue-300">⌁</div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Monitored endpoint</p>
                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Demo API — generated dummy data</h2>
                  <span className="mt-3 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">Demo environment</span>
                </div>
              </div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${isUp ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-red-400/30 bg-red-500/10 text-red-300"}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${isUp ? "bg-emerald-400" : "bg-red-400"}`} />
                {statusText}
              </span>
            </div>

            <div className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div><p className="text-xs uppercase tracking-wider text-gray-500">Check type</p><p className="mt-2 font-semibold text-gray-200">HTTP health check</p></div>
              <div><p className="text-xs uppercase tracking-wider text-gray-500">Schedule</p><p className="mt-2 font-semibold text-gray-200">Every 15 seconds</p></div>
              <div><p className="text-xs uppercase tracking-wider text-gray-500">Environment</p><p className="mt-2 font-semibold text-gray-200">Local demo</p></div>
            </div>

            <button onClick={() => void checkApi()} disabled={checking} className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-900/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {checking ? "Checking endpoint..." : "Check API now"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
