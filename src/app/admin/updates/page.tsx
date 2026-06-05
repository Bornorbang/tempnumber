"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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
    // select "url" or "text" so admin can type immediately
    const anchor = start + (sel ? sel.length + 3 : 1);
    const focus  = start + (sel ? sel.length + 6 : 5);
    ta.setSelectionRange(anchor, focus);
  }, 0);
}

type Update = { id: number; content: string; created_at: string };

export default function AdminUpdatesPage() {
  const [items, setItems]         = useState<Update[]>([]);
  const [loading, setLoading]     = useState(true);
  const [draft, setDraft]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [error, setError]         = useState("");
  // Edit state
  const [editId, setEditId]       = useState<number | null>(null);
  const [editText, setEditText]   = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const draftRef  = useRef<HTMLTextAreaElement>(null);
  const editRef   = useRef<HTMLTextAreaElement>(null);

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/updates", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd() {
    const text = draft.trim();
    if (!text) return;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/updates", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      setDraft("");
      load();
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  }

  function startEdit(item: Update) {
    setEditId(item.id);
    setEditText(item.content);
    setEditError("");
  }

  function cancelEdit() {
    setEditId(null);
    setEditText("");
    setEditError("");
  }

  async function handleEdit() {
    if (!editId) return;
    const text = editText.trim();
    if (!text) return;
    setEditSaving(true); setEditError("");
    try {
      const res = await fetch("/api/admin/updates", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, content: text }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error ?? "Failed to update"); return; }
      cancelEdit();
      load();
    } catch { setEditError("Network error"); }
    finally { setEditSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await fetch("/api/admin/updates", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      load();
    } finally { setDeleting(null); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Marquee Updates</h1>
        <p className="text-gray-400 text-sm mt-1">
          These short messages scroll across the dashboard greeting for all users.
        </p>
      </div>

      {/* Add new */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
        <h2 className="text-[var(--text-primary)] text-sm font-semibold">Add Update</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => insertLinkSyntax(draft, setDraft, draftRef)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 transition-colors"
            title="Insert link — select text first to wrap it"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Insert Link
          </button>
          <span className="text-gray-500 text-xs">Use [text](url) syntax</span>
        </div>
        <textarea
          ref={draftRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. New wallet top-up methods now available!"
          maxLength={500}
          rows={2}
          className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">{draft.length}/500</span>
          <button
            onClick={handleAdd}
            disabled={saving || !draft.trim()}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            {saving ? "Savingâ€¦" : "Add Update"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)]">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Updates ({items.length})</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="w-5 h-5 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">No updates yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {items.map((item) =>
              editId === item.id ? (
                /* â”€â”€ Inline edit row â”€â”€ */
                <div key={item.id} className="px-5 py-4 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => insertLinkSyntax(editText, setEditText, editRef)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 border border-[var(--border-color)] rounded-lg px-2.5 py-1 transition-colors"
                      title="Insert link"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Insert Link
                    </button>
                  </div>
                  <textarea
                    ref={editRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={500}
                    rows={2}
                    autoFocus
                    className="w-full bg-[var(--bg-card-inner)] border border-green-500/60 text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 resize-none"
                  />
                  {editError && <p className="text-red-400 text-xs">{editError}</p>}
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-gray-500 text-xs mr-auto">{editText.length}/500</span>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-400 hover:text-[var(--text-primary)] text-xs font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--bg-card-inner)]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEdit}
                      disabled={editSaving || !editText.trim()}
                      className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      {editSaving ? "Savingâ€¦" : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                /* â”€â”€ Normal row â”€â”€ */
                <div key={item.id} className="flex items-start gap-3 px-5 py-4">
                  <p className="flex-1 text-[var(--text-primary)] text-sm">{item.content}</p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50 transition-colors"
                    >
                      {deleting === item.id ? "â€¦" : "Delete"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
