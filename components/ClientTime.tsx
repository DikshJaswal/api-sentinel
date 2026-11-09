"use client";

import { useEffect, useState } from "react";

export default function ClientTime() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setTime(new Date().toLocaleTimeString());
    }, 0);

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!mounted) {
    return <span className="text-gray-400 text-sm">Last updated: --:--:--</span>;
  }

  return <span className="text-gray-400 text-sm">Last updated: {time}</span>;
}
