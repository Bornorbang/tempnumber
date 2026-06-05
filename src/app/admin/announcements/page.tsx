"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Announcement = { id: number; title: string; badge: string; content: string; image_url?: string; created_at: string };

function renderRichText(text: string) {
  const parts = text.split(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g);
  return parts.map((part, i) => {
    if (i % 3 === 0) return part || null;
    if (i % 3 === 1) {
      const url = parts[i + 1];
      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{part}</a>;
    }
    return null;
  });
}

function insertLinkSyntax(
  value: string,
  setValue: (v: string) => void,
  ref: React.RefObject<HTMLTextAreaElement | null>
) {
  const ta = ref.current;
  if (!ta) return;
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  const sel   = value.slice(start, end);
  const insert = sel ? `[${sel}](url)` : `[text](url)`;
  const next   = value.slice(0, start) + insert + value.slice(end);
  setValue(next);
  setTimeout(() => {
    ta.focus();
    const anchor = start + (sel ? sel.length + 3 : 1);
    const focus  = start + (sel ? sel.length + 6 : 5);
    ta.setSelectionRange(anchor, focus);
  }, 0);
}

const BADGES = ["New", "Update", "Feature", "Info", "Warning"] as const;
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

export default function AdminAnnouncementsPage() {
  const [items, setItems]     = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy]       = useState(false);
  const [err, setErr]         = useState<string | null>(null);

  const [title,   setTitle]   = useState("");
  const [badge,   setBadge]   = useState<(typeof BADGES)[number]>("Update");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const contentRef = useRef<HTMLTextAreaElement>(null);

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  const load = useCallback(() => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    if (!title.trim() || !content.trim()) { setErr("Title and content are required."); return; }
    setBusy(true); setErr(null);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ title, badge, content, image_url: imageUrl || undefined }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(data.error ?? "Failed"); return; }
    setTitle(""); setBadge("Update"); setContent(""); setImageUrl(""); setShowForm(false);
    load();
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch("/api/admin/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">Post and manage platform announcements.</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setErr(null); }}
          className="flex-shrink-0 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
          <h2 className="text-[var(--text-primary)] font-semibold text-sm mb-1">New Announcement</h2>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title…"
              className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Badge</label>
            <select value={badge} onChange={(e) => setBadge(e.target.value as typeof badge)}
              className="bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500">
              {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-400 text-xs">Content</label>
              <button
                type="button"
                onClick={() => insertLinkSyntax(content, setContent, contentRef)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 border border-[var(--border-color)] rounded-lg px-2 py-1 transition-colors"
                title="Insert link — select text first to wrap it"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Insert Link
              </button>
            </div>
            <textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Announcement content… Use [text](url) for links."
              className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 resize-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">Image URL <span className="text-gray-600">(optional)</span></label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              type="url"
              className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500"
            />
            {imageUrl && /^https?:\/\/.+/.test(imageUrl) && (
              <img src={imageUrl} alt="Preview" className="mt-2 rounded-xl max-h-32 object-cover border border-[var(--border-color)]" />
            )}
          </div>
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 text-sm px-4 py-2 rounded-xl border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] transition-colors">Cancel</button>
            <button onClick={create} disabled={busy} className="flex-1 text-sm px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors disabled:opacity-60">
              {busy ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[var(--text-primary)] font-semibold text-sm leading-snug">{a.title}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLES[a.badge] ?? "bg-gray-500/15 text-gray-400"}`}>{a.badge}</span>
                </div>
                <button
                  onClick={() => remove(a.id, a.title)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{renderRichText(a.content)}</p>
              {a.image_url && /^https?:\/\/.+/.test(a.image_url) && (
                <img src={a.image_url} alt="" className="mt-2 rounded-xl max-h-32 object-cover border border-[var(--border-color)]" />
              )}
              <p className="text-gray-500 text-xs mt-2">{formatDate(a.created_at)}</p>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-sm text-center py-10">No announcements yet.</p>}
        </div>
      )}
    </div>
  );
}
