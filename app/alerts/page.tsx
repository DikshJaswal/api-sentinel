"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { IncidentAlert } from "@/lib/types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<IncidentAlert[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccessMessage, setTestSuccessMessage] = useState("");

  const loadAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/alerts", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 10000);
    return () => clearInterval(interval);
  }, [loadAlerts]);

  const handleSendTestAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTest(true);
    setTestSuccessMessage("");

    try {
      const res = await fetch("/api/alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmail.trim() || undefined,
          targetPhone: testPhone.trim() || undefined,
          serviceName: "Production Synthetic Audit",
        }),
      });

      if (res.ok) {
        setTestSuccessMessage("Alert dispatched successfully! Check the event stream below.");
        await loadAlerts();
        setTimeout(() => {
          setShowTestModal(false);
          setTestSuccessMessage("");
        }, 1500);
      }
    } catch (err) {
      console.error("Test alert failed:", err);
    } finally {
      setSendingTest(false);
    }
  };

  const outages = alerts.filter((a) => a.type === "OUTAGE");

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="relative z-10 w-full flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                Incident Response Center
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Alerts & Notifications
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Multi-channel synthetic incident telemetry via Twilio SendGrid (Email), Twilio SMS, and Webhooks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTestModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/25 transition hover:brightness-110 active:scale-95"
              >
                ⚡ Trigger Test Alert
              </button>
              <Link
                href="/dashboard"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                ← Dashboard
              </Link>
            </div>
          </header>

          {/* Alert Status Banner */}
          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-red-300">Active Outages</p>
              <p className="mt-2 text-3xl font-black text-white">{outages.length}</p>
              <p className="mt-1 text-xs text-gray-400">Requiring immediate attention</p>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Notification Channel</p>
              <p className="mt-2 text-2xl font-black text-white">Twilio SendGrid</p>
              <p className="mt-1 text-xs text-gray-400">HTTPS REST API (Port 443)</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Deduplication State</p>
              <p className="mt-2 text-2xl font-black text-emerald-300">Active (Smart Cooldown)</p>
              <p className="mt-1 text-xs text-gray-400">1 alert per outage + recovery confirm</p>
            </div>
          </section>

          {/* Configuration Card */}
          <section className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-transparent p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📱</span> Alert Delivery Integrations
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  API Sentinel dispatches alerts over HTTP APIs (Twilio SendGrid & Twilio SMS), fully bypassing Vercel serverless SMTP port blocks.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 font-semibold text-emerald-300">
                  SendGrid Email: Active
                </span>
                <span className="rounded-lg bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 font-semibold text-blue-300">
                  Twilio SMS: Ready
                </span>
                <span className="rounded-lg bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 font-semibold text-purple-300">
                  Discord: Ready
                </span>
              </div>
            </div>
          </section>

          {/* Alerts Feed */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">Dispatched Incident Logs</h2>
              <span className="text-xs text-gray-400">{alerts.length} Total Dispatches</span>
            </div>

            {alerts.length === 0 ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl text-emerald-400">
                  ✓
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">All Systems Healthy</h3>
                <p className="mt-1 text-sm text-gray-400">
                  No active outages detected. Any service interruption will be logged and dispatched here immediately.
                </p>
              </div>
            ) : (
              alerts.map((alert) => {
                const isOutage = alert.type === "OUTAGE";
                const isRecovery = alert.type === "RECOVERY";

                return (
                  <article
                    key={alert.id}
                    className={`rounded-2xl border p-5 backdrop-blur-xl shadow-lg transition hover:border-white/20 ${
                      isOutage
                        ? "border-red-500/30 bg-gradient-to-r from-red-500/[0.1] to-orange-500/[0.03]"
                        : isRecovery
                        ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/[0.1] to-teal-500/[0.03]"
                        : "border-blue-500/30 bg-gradient-to-r from-blue-500/[0.1] to-purple-500/[0.03]"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                            isOutage
                              ? "bg-red-500/20 text-red-400"
                              : isRecovery
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {isOutage ? "!" : isRecovery ? "✓" : "⚡"}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                isOutage
                                  ? "bg-red-500/20 text-red-300"
                                  : isRecovery
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-blue-500/20 text-blue-300"
                              }`}
                            >
                              {alert.type}
                            </span>
                            <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
                              Channel: {alert.channel.replace("_", " ")}
                            </span>
                            <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-gray-400">
                              Recipient: {alert.recipient}
                            </span>
                          </div>

                          <h3 className="mt-2 text-sm font-bold text-white">
                            {alert.serviceName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-300">{alert.message}</p>

                          {alert.details?.url && (
                            <p className="mt-1.5 font-mono text-[11px] text-blue-400">
                              Target: {alert.details.url}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs text-gray-500 sm:shrink-0">
                        <time>{new Date(alert.createdAt).toLocaleString()}</time>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>

          {/* Test Alert Modal */}
          {showTestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="w-full max-w-md rounded-3xl border border-white/20 bg-gray-950 p-6 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white">Send Synthetic Test Alert</h2>
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSendTestAlert} className="mt-6 space-y-4">
                  {testSuccessMessage && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                      {testSuccessMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Target Gmail / Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g., yourname@gmail.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Sent via Twilio SendGrid / Simulated Log
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Optional Phone Number (Twilio SMS)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTestModal(false)}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingTest}
                      className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/25 hover:brightness-110 disabled:opacity-50"
                    >
                      {sendingTest ? "Dispatching..." : "Send Test Incident"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
