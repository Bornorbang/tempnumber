"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedStat({
  end,
  suffix,
  decimals = 0,
  duration = 1500,
}: {
  end: number;
  suffix: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setValue(end);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return (
    <>
      {display}
      {suffix}
    </>
  );
}

const STATS = [
  { end: 50, suffix: "+", decimals: 0, label: "Services Supported" },
  { end: 1, suffix: "M+", decimals: 0, label: "Numbers Available" },
  { end: 50, suffix: "M+", decimals: 0, label: "SMS Delivered" },
  { end: 99.9, suffix: "%", decimals: 1, label: "Uptime" },
];

export default function Stats() {
  return (
    <section className="bg-slate-50 dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-base sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-0.5 sm:mb-1">
                <AnimatedStat
                  end={stat.end}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-sm leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
