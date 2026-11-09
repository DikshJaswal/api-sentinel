"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { MonitoredService, ServiceCategory } from "@/lib/types";

export default function APIsPage() {
  const [services, setServices] = useState<MonitoredService[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Production API");
  const [method, setMethod] = useState<"GET" | "POST" | "HEAD">("GET");
  const [expectedCode, setExpectedCode] = useState(200);
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [formError, setFormError] = useState("");

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCheckService = async (id: string) => {
    setCheckingId(id);
    try {
      const res = await fetch("/api/services/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await loadServices();
      }
    } catch (err) {
      console.error("Check failed:", err);
    } finally {
      setCheckingId(null);
    }
  };

  const handleToggleActive = async (service: MonitoredService) => {
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id, isActive: !service.isActive }),
      });
      if (res.ok) {
        await loadServices();
      }
    } catch (err) {
      console.error("Toggle active failed:", err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to remove this endpoint from monitoring?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadServices();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !url.trim()) {
      setFormError("Name and URL are required.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setFormError("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          category,
          method,
          expectedCode,
          timeoutMs,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setName("");
        setUrl("");
        await loadServices();
      } else {
        const errorData = await res.json();
        setFormError(errorData.error || "Failed to add service.");
      }
    } catch {
      setFormError("Network request failed.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="relative z-10 w-full flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                Service Management
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Monitored Target APIs
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Configure synthetic probes, SLA thresholds, and active monitoring intervals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 active:scale-95"
              >
                + Add New Service
              </button>
              <Link
                href="/dashboard"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                ← Dashboard
              </Link>
            </div>
          </header>

          {/* Quick Metrics */}
          <section className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Total Registered</p>
              <p className="mt-2 text-3xl font-black text-white">{services.length}</p>
              <p className="mt-1 text-xs text-gray-400">Production and microservice targets</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Active Probes</p>
              <p className="mt-2 text-3xl font-black text-emerald-300">
                {services.filter((s) => s.isActive).length}
              </p>
              <p className="mt-1 text-xs text-gray-400">Under synthetic health checks</p>
            </div>
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.08] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Outage Threshold</p>
              <p className="mt-2 text-3xl font-black text-white">5000 ms</p>
              <p className="mt-1 text-xs text-gray-400">Max acceptable HTTP timeout</p>
            </div>
          </section>

          {/* Service Cards List */}
          <section className="space-y-4">
            {services.map((service) => {
              const isUp = service.lastStatus === "UP";
              const isChecking = checkingId === service.id;

              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-xl shadow-xl transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-lg bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          {service.category}
                        </span>
                        <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-gray-300">
                          {service.method}
                        </span>
                        <span className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-gray-400">
                          Expect HTTP {service.expectedCode}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isUp
                              ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-300"
                              : "bg-red-500/10 border border-red-400/30 text-red-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isUp ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          {service.lastStatus}
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-lg font-bold text-white">{service.name}</h3>
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-blue-400 hover:underline break-all"
                      >
                        {service.url} ↗
                      </a>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex flex-wrap items-center gap-6 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Latency</p>
                        <p className="mt-1 text-sm font-black text-white">
                          {service.lastLatency !== null ? `${service.lastLatency} ms` : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">SLA Uptime</p>
                        <p className="mt-1 text-sm font-black text-emerald-400">
                          {service.uptimeScore}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Last Checked</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {service.lastChecked
                            ? new Date(service.lastChecked).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            : "Never"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => handleCheckService(service.id)}
                        disabled={isChecking}
                        className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500 disabled:opacity-50"
                      >
                        {isChecking ? "Checking..." : "Check Now"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(service)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          service.isActive
                            ? "border-white/10 bg-white/[0.05] text-gray-300 hover:bg-white/10"
                            : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                        }`}
                      >
                        {service.isActive ? "Pause" : "Resume"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                        title="Delete service"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Add Service Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-gray-950 p-6 shadow-2xl sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold text-white">Add Monitored API</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddService} className="mt-6 space-y-4">
                  {formError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Service Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Payment Gateway Service"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Target Endpoint URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/api/health"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-gray-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      >
                        <option value="Production API">Production API</option>
                        <option value="Frontend App">Frontend App</option>
                        <option value="Microservice">Microservice</option>
                        <option value="Third-Party">Third-Party</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                        HTTP Method
                      </label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as "GET" | "POST" | "HEAD")}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-gray-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="HEAD">HEAD</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                        Expected HTTP Code
                      </label>
                      <input
                        type="number"
                        value={expectedCode}
                        onChange={(e) => setExpectedCode(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                        Timeout (ms)
                      </label>
                      <input
                        type="number"
                        value={timeoutMs}
                        onChange={(e) => setTimeoutMs(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-110"
                    >
                      Save Endpoint
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
