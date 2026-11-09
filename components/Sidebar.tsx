"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Services", path: "/apis", icon: "🔗" },
  { name: "Incidents & Alerts", path: "/alerts", icon: "🚨" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-gray-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-colors lg:hidden shadow-lg"
        aria-label="Toggle Navigation Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-950/95 border-r border-white/10 backdrop-blur-2xl z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-7 h-full flex flex-col justify-between">
          {/* Header & Logo */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/30 border border-blue-400/40">
                <span className="text-xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  API Sentinel
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-400/30">
                    v2.0
                  </span>
                </h1>
                <p className="text-xs font-medium text-gray-400">Synthetic Health & SLA</p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
              {items.map((item) => {
                const active = pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/10 text-white border border-blue-400/40 shadow-lg shadow-blue-500/15 backdrop-blur-sm"
                        : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>

                    {active && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-400 shadow-md shadow-blue-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Monitored Suite Footer */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Connected Services</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="truncate max-w-[120px]">RESOLVE Backend</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="truncate max-w-[120px]">RESOLVE Client</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="truncate max-w-[120px]">CodeFlow JS</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <p className="text-xs font-semibold text-emerald-300">Continuous Monitoring Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 w-full h-full border-none cursor-default"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close Mobile Navigation"
        />
      )}
    </>
  );
}
