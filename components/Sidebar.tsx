"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "APIs", path: "/apis", icon: "🔗" },
  { name: "Alerts", path: "/alerts", icon: "🚨" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-black/90 border-r border-gray-800/50 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-8 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/40 border border-blue-400/50">
              <span className="text-xl font-bold text-white">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                API Sentinel
              </h1>
              <p className="text-sm font-medium text-gray-400">Monitoring Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {items.map((item) => {
              const active = pathname === item.path;

              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-400/50 shadow-lg shadow-blue-500/20 backdrop-blur-sm"
                      : "text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-white hover:translate-x-2 hover:shadow-lg hover:shadow-blue-500/20"
                  }`}
                >
                  <span className="text-xl transition-transform group-hover:scale-110">{item.icon}</span>
                  <span className="transition-colors">{item.name}</span>
                  
                  {active && (
                    <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto">
            <div className="rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 backdrop-blur-sm p-4">
              <p className="text-sm font-bold text-green-300">System Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                <p className="text-sm font-medium text-green-200">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
