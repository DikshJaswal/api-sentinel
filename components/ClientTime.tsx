"use client";

import { useEffect, useState } from "react";

export default function ClientTime() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <span className="text-gray-400 text-sm">Last updated: --:--:--</span>;
  }

  return <span className="text-gray-400 text-sm">Last updated: {time}</span>;
}
