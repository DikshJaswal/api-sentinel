"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ResponseTimeChart from "@/components/ResponseTimeChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonCard from "@/components/SkeletonCard";
import ClientTime from "@/components/ClientTime";

interface Log {
  status: "UP" | "DOWN";
  responseTime: number | null;
  createdAt: string;
}

//  SAFE JSON PARSER (VERY IMPORTANT)
async function safeJson(res: Response) {
  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [status, setStatus] = useState("...");
  const [responseTime, setResponseTime] = useState("0 ms");
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derived analytics
  const upCount = logs.filter((l) => l.status === "UP").length;
  const downCount = logs.filter((l) => l.status === "DOWN").length;

  const totalChecks = upCount + downCount;
  const healthScore = totalChecks
    ? Math.round((upCount / totalChecks) * 100)
    : 100;

  const healthLabel =
    healthScore >= 95
      ? "Excellent"
      : healthScore >= 80
      ? "Good"
      : "Degraded";

  const rt = parseInt(responseTime);
  const rtLabel =
    rt < 500 ? "Fast" : rt <= 1000 ? "Moderate" : "Slow";

  // Auto monitoring + polling
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Trigger monitoring (DB insert happens here)
        const monitorRes = await fetch("/api/monitor");
        const monitorData = await safeJson(monitorRes);

        if (mounted && monitorData) {
          setStatus(monitorData.status);
          setResponseTime(`${monitorData.responseTime} ms`);
        }

        // Fetch recent logs
        const logsRes = await fetch("/api/logs/recent");
        const logsData = await safeJson(logsRes);

        if (mounted && Array.isArray(logsData)) {
          setLogs(logsData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 15000); // every 15 sec

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ----UI---
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="lg:ml-64 flex-1 max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                Dashboard
              </h1>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border transition-all duration-200 hover:scale-105 ${
                  status === "UP" 
                    ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-300 border-green-400/40 shadow-lg shadow-green-500/20" 
                    : "bg-gradient-to-r from-red-600/30 to-pink-600/30 text-red-300 border-red-400/40 shadow-lg shadow-red-500/20"
                }`}>
                  <div className={`h-3 w-3 rounded-full ${status === "UP" ? "bg-green-400" : "bg-red-400"} ${status === "UP" ? "animate-pulse shadow-lg shadow-green-400/50" : "shadow-lg shadow-red-400/50"}`} />
                  <span className="uppercase tracking-wider">{status}</span>
                </div>
                <ClientTime />
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 flex items-center gap-3 border border-white/20"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : null}
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        {downCount > 0 && (
          <div className="mb-8 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 backdrop-blur-sm shadow-lg shadow-red-500/20">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/30 border border-red-400/40">
                <span className="text-red-300 text-2xl animate-pulse">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-red-300">API failures detected</p>
                <p className="text-sm font-medium text-red-200/80">Please check system health and investigate recent incidents immediately.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                title="API Status"
                value={status}
                accent={status === "UP" ? "green" : "red"}
              />

              <StatCard 
                title="Monitored APIs" 
                value="1"
                accent="purple"
              />

              <StatCard
                title="Response Time"
                value={`${responseTime}`}
                accent={rt < 500 ? "green" : rt <= 1000 ? "blue" : "red"}
                trend={{
                  value: Math.floor(Math.random() * 20) - 10,
                  isPositive: rt < 1000
                }}
              />

              <StatCard
                title="APIs UP"
                value={upCount.toString()}
                accent="green"
                trend={{
                  value: Math.floor(Math.random() * 15),
                  isPositive: true
                }}
              />

              <StatCard
                title="APIs DOWN"
                value={downCount.toString()}
                accent="red"
                trend={{
                  value: downCount > 0 ? Math.floor(Math.random() * 10) : 0,
                  isPositive: false
                }}
              />
            </>
          )}
        </div>

        {/* Health Score */}
        <div className="mb-8">
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <StatCard
              title="Health Score (SLA)"
              value={`${healthScore}%`}
              accent={
                healthScore >= 95
                  ? "green"
                  : healthScore >= 80
                  ? "blue"
                  : "red"
              }
              trend={{
                value: healthScore >= 95 ? 5 : healthScore >= 80 ? 2 : -3,
                isPositive: healthScore >= 80
              }}
            />
          )}
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ResponseTimeChart />
        </div>

        {/* Recent Events */}
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Recent Events
            </h3>
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              Last 10 events
            </span>
          </div>

          <div className="space-y-3">
            {logs.slice(-5).reverse().map((log, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className={`h-3 w-3 rounded-full ${
                  log.status === "UP"
                    ? "bg-green-400 shadow-lg shadow-green-400/50"
                    : "bg-red-400 shadow-lg shadow-red-400/50"
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      API {log.status}
                    </span>
                    {log.responseTime !== null && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                        {log.responseTime} ms
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  log.status === "UP"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {log.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
