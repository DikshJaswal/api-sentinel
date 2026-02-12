"use client";
import { usePathname } from "next/navigation";

const items = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "APIs", path: "/apis" },
  { name: "Alerts", path: "/alerts" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#020617] border-r border-white/10 px-6 py-8">
      <h1 className="mb-10 text-xl font-bold text-white">
        API Sentinel
      </h1>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.path;

          return (
            <a
              key={item.name}
              href={item.path}
              className={`block rounded-lg px-4 py-3 text-sm transition
                ${
                  active
                    ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              {item.name}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
