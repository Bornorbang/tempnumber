"use client";

import { useState, useEffect, useRef } from "react";

type MarqueeUpdate = { id: number; content: string };

const SPEED_PX_PER_S = 80; // pixels per second

export default function UpdateMarquee() {
  const [items, setItems]       = useState<MarqueeUpdate[]>([]);
  const containerRef            = useRef<HTMLDivElement>(null);
  const spanRef                 = useRef<HTMLSpanElement>(null);
  const [ready, setReady]       = useState(false);
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    fetch("/api/updates", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: MarqueeUpdate[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // After items render, measure widths and set animation parameters
  useEffect(() => {
    if (!items.length || !containerRef.current || !spanRef.current) return;

    const containerW = containerRef.current.offsetWidth;
    const spanW      = spanRef.current.offsetWidth;
    // Total travel: span starts at left:100% (right edge of container) and
    // moves left until it fully clears the container's left edge.
    // Travel = containerW + spanW  (in px, negative direction)
    const travel     = containerW + spanW;
    const dur        = travel / SPEED_PX_PER_S;

    spanRef.current.style.setProperty("--marquee-travel", `-${travel}px`);
    setDuration(dur);
    setReady(true);
  }, [items]);

  if (!items.length) return null;

  // Strip [text](url) markdown — links can't be clicked in a marquee, show label only
  const stripLinks = (s: string) => s.replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1");
  const text = items.map((u) => stripLinks(u.content)).join("   ·   ");

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative self-center h-7"
      // Fade left edge so text dissolves into the greeting text
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
      }}
    >
      <span
        ref={spanRef}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-green-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full"
        style={{
          left: "100%",
          animation: ready ? `marquee-rtl ${duration}s linear infinite` : "none",
          willChange: "transform",
        }}
      >
        {text}
      </span>
    </div>
  );
}
