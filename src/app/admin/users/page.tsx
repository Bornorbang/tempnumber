"use client";

import { useState, useEffect, useCallback } from "react";

type User = {
  id: number; name: string; email: string;
  wallet_balance: number; is_admin: boolean; is_disabled: boolean; created_at: string;
};

type Modal =
  | { type: "wallet"; user: User }
  | { type: "profile"; user: User }
  | null;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

const PAGE_SIZE = 100;

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [modal, setModal]     = useState<Modal>(null);
  const [busy, setBusy]       = useState(false);
  const [msg, setMsg]         = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const totalPages    = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Wallet adjust form
  const [walletAmt, setWalletAmt] = useState("");
  // Profile edit form
  const [profName, setProfName]   = useState("");
  const [profEmail, setProfEmail] = useState("");

  function getToken() { return localStorage.getItem("tn_token") ?? ""; }

  const load = useCallback((q = "") => {
    setLoading(true);
    const qs = q ? `?search=${encodeURIComponent(q)}` : "";
    fetch(`/api/admin/users${qs}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function post(action: string, extra: Record<string, unknown>) {
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg({ type: "err", text: data.error ?? "Failed" }); return null; }
    return data;
  }

  async function adjustWallet() {
    const amount = parseFloat(walletAmt);
    if (isNaN(amount) || amount === 0 || !modal || modal.type !== "wallet") return;
    const data = await post("adjust_wallet", { user_id: modal.user.id, amount });
    if (data) {
      setMsg({ type: "ok", text: `New balance: ₦${data.new_balance.toLocaleString()}` });
      load(search);
    }
  }

  async function toggleAdmin(user: User) {
    if (!confirm(`${user.is_admin ? "Remove" : "Grant"} admin for ${user.email}?`)) return;
    const data = await post("toggle_admin", { user_id: user.id });
    if (data) { load(search); }
  }

  async function updateProfile() {
    if (!modal || modal.type !== "profile") return;
    const data = await post("update_profile", { user_id: modal.user.id, name: profName, email: profEmail });
    if (data) {
      setMsg({ type: "ok", text: "Profile updated." });
      load(search);
    }
  }

  async function toggleDisable() {
    if (!modal || modal.type !== "profile") return;
    const user = modal.user;
    const action = user.is_disabled ? "Enable" : "Disable";
    if (!confirm(`${action} account for ${user.email}?`)) return;
    const data = await post("disable_user", { user_id: user.id });
    if (data) {
      setMsg({ type: "ok", text: `Account ${data.is_disabled ? "disabled" : "enabled"}.` });
      load(search);
    }
  }

  async function loginAs(user: User) {
    if (!confirm(`Log in as ${user.name} (${user.email})?`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ action: "login_as", user_id: user.id }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.token) { alert(data.error ?? "Failed"); return; }
    // Store the user token and do a hard redirect so AuthContext re-initialises fully
    localStorage.setItem("tn_token", data.token);
    localStorage.setItem("tn_user", JSON.stringify(data.user));
    window.location.href = "/dashboard";
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold">Users</h1>
          <p className="text-gray-400 text-sm mt-1">{users.length} user{users.length !== 1 ? "s" : ""} found{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}</p>
        </div>
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); load(e.target.value); }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 w-64"
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card-inner)] text-xs text-gray-500 font-medium uppercase tracking-wide">
          <span>User</span>
          <span>Email</span>
          <span className="text-right">Balance</span>
          <span className="text-center">Role</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="w-6 h-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {paginatedUsers.map((u) => (
              <div key={u.id} className={`px-5 py-3.5 flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 sm:items-center ${u.is_disabled ? "opacity-60" : ""}`}>
                <div>
                  <p className="text-[var(--text-primary)] text-sm font-medium flex items-center gap-1.5">
                    {u.name}
                    {u.is_disabled && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">Disabled</span>}
                  </p>
                  <p className="text-gray-500 text-xs">{formatDate(u.created_at)}</p>
                </div>
                <p className="text-gray-400 text-sm truncate">{u.email}</p>
                <p className="text-[var(--text-primary)] text-sm font-semibold text-right">
                  ₦{u.wallet_balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex justify-center">
                  {u.is_admin ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Admin</span>
                  ) : (
                    <button
                      onClick={() => loginAs(u)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
                    >
                      Login
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 justify-end flex-wrap">
                  <button
                    onClick={() => { setWalletAmt(""); setMsg(null); setModal({ type: "wallet", user: u }); }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                  >
                    Wallet
                  </button>
                  <button
                    onClick={() => { setProfName(u.name); setProfEmail(u.email); setMsg(null); setModal({ type: "profile", user: u }); }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAdmin(u)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-card-inner)] text-gray-400 hover:text-[var(--text-primary)] transition-colors"
                  >
                    {u.is_admin ? "Revoke" : "Make Admin"}
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && !loading && (
              <p className="text-gray-500 text-sm text-center py-10">No users found.</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                p === page
                  ? "bg-green-500 text-white font-semibold"
                  : "border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {modal.type === "wallet" && (
              <>
                <h2 className="text-[var(--text-primary)] font-bold text-base mb-1">Adjust Wallet</h2>
                <p className="text-gray-400 text-sm mb-4">{modal.user.name} — current ₦{modal.user.wallet_balance.toLocaleString()}</p>
                <p className="text-gray-400 text-xs mb-1">Amount (negative to deduct)</p>
                <input
                  type="number"
                  value={walletAmt}
                  onChange={(e) => setWalletAmt(e.target.value)}
                  placeholder="e.g. 5000 or -2000"
                  className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 mb-4"
                />
                {msg && <p className={`text-xs mb-3 ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setModal(null)} className="flex-1 text-sm px-4 py-2 rounded-xl border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                  <button onClick={adjustWallet} disabled={busy} className="flex-1 text-sm px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors disabled:opacity-60">
                    {busy ? "Saving…" : "Apply"}
                  </button>
                </div>
              </>
            )}
            {modal.type === "profile" && (
              <>
                <h2 className="text-[var(--text-primary)] font-bold text-base mb-4">Edit Profile</h2>
                <label className="block text-gray-400 text-xs mb-1">Name</label>
                <input value={profName} onChange={(e) => setProfName(e.target.value)} className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 mb-3" />
                <label className="block text-gray-400 text-xs mb-1">Email</label>
                <input value={profEmail} onChange={(e) => setProfEmail(e.target.value)} className="w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-green-500 mb-4" />
                {msg && <p className={`text-xs mb-3 ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setModal(null)} className="flex-1 text-sm px-4 py-2 rounded-xl border border-[var(--border-color)] text-gray-400 hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                  <button onClick={updateProfile} disabled={busy} className="flex-1 text-sm px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors disabled:opacity-60">
                    {busy ? "Saving…" : "Save"}
                  </button>
                </div>
                <button
                  onClick={toggleDisable}
                  disabled={busy}
                  className={`w-full text-sm px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-60 ${
                    modal.user.is_disabled
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  {modal.user.is_disabled ? "Enable Account" : "Disable Account"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
