"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Alert {
  id: number;
  status: "UP" | "DOWN";
  createdAt: string;
  responseTime: number | null;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  async function loadAlerts() {
    try {
      const response = await fetch("/api/logs/recent", { cache: "no-store" });
      const data = await response.json();
      setAlerts(data.filter((log: Alert) => log.status === "DOWN"));
    } catch {
      setAlerts([]);
    }
  }

  useEffect(() => {
    void loadAlerts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="relative z-10 w-full flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-400">Incident center</p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Alerts</h1>
              <p className="mt-3 max-w-2xl text-gray-400">Stay on top of failed checks and investigate service interruptions.</p>
            </div>
            <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white">
              <span className="text-lg">←</span> Dashboard
            </Link>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-400/25 bg-red-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-300">Active alerts</p>
              <p className="mt-3 text-3xl font-black text-white">{alerts.length}</p>
              <p className="mt-1 text-sm text-gray-400">Failed demo checks</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Alert state</p>
              <p className="mt-3 text-3xl font-black text-emerald-300">{alerts.length ? "Review" : "Clear"}</p>
              <p className="mt-1 text-sm text-gray-400">Based on recent checks</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Source</p>
              <p className="mt-3 text-2xl font-black text-white">API Sentinel</p>
              <p className="mt-1 text-sm text-gray-400">Live demo monitoring</p>
            </div>
          </section>

          {alerts.length === 0 ? (
            <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.12] to-white/[0.03] p-8 shadow-2xl shadow-emerald-950/20 sm:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-400/10 text-4xl text-emerald-300">✓</div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Everything is healthy</p>
                <h2 className="mt-3 text-3xl font-black text-white">No active alerts</h2>
                <p className="mx-auto mt-3 max-w-lg text-gray-400">All recent demo checks are operating normally. When a check fails, it will appear here for review.</p>
                <button onClick={() => void loadAlerts()} className="mt-8 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-gray-200 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-white">Refresh alerts</button>
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-white">Recent incidents</h2><button onClick={() => setAlerts([])} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white">Dismiss all</button></div>
              {alerts.map((alert) => (
                <article key={alert.id} className="rounded-2xl border border-red-400/25 bg-gradient-to-r from-red-500/[0.12] to-orange-500/[0.06] p-6 shadow-lg shadow-red-950/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-2xl text-red-300">!</div>
                    <div className="flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="font-bold text-red-200">API check failed</h3><span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-300">Critical</span></div><p className="mt-2 text-sm text-gray-400">The demo endpoint reported a DOWN status.</p></div>
                    <time className="text-sm text-gray-500">{new Date(alert.createdAt).toLocaleString()}</time>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
