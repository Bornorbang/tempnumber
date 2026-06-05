"use client";

import { useState, useEffect } from "react";

type Announcement = { id: number; title: string; badge: string; content: string; image_url?: string; created_at: string };

const BADGE_STYLES: Record<string, string> = {
  New:     "bg-green-500/15 text-green-500",
  Update:  "bg-blue-500/15 text-blue-400",
  Feature: "bg-purple-500/15 text-purple-400",
  Info:    "bg-sky-500/15 text-sky-400",
  Warning: "bg-yellow-500/15 text-yellow-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
}

/** Renders [text](url) markdown links as <a> tags. Plain text is kept as-is. */
function renderRichText(text: string) {
  const parts = text.split(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g);
  return parts.map((part, i) => {
    if (i % 3 === 0) return part || null;
    if (i % 3 === 1) {
      const url = parts[i + 1];
      return (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
          className="text-green-500 hover:underline">
          {part}
        </a>
      );
    }
    return null; // URL token — consumed above
  });
}

export default function AnnouncementsPage() {
  const [items, setItems]     = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Announcements</h1>
        <p className="text-gray-400 text-sm mt-1">Stay up to date with the latest news and platform updates.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <article key={a.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h2 className="text-[var(--text-primary)] font-semibold text-base leading-snug">{a.title}</h2>
                <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[a.badge] ?? "bg-gray-500/15 text-gray-400"}`}>
                  {a.badge}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{renderRichText(a.content)}</p>
              {a.image_url && /^https?:\/\/.+/.test(a.image_url) && (
                <img src={a.image_url} alt="" className="mt-3 rounded-xl max-w-full max-h-64 object-cover border border-[var(--border-color)]" />
              )}
              <p className="text-gray-500 text-xs mt-3">{formatDate(a.created_at)}</p>
            </article>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-10">No announcements yet.</p>
          )}
        </div>
      )}

      <p className="text-gray-500 text-xs text-center pb-2">
        All announcements are from the Temp Number team. More updates coming soon.
      </p>
    </div>
  );
}
