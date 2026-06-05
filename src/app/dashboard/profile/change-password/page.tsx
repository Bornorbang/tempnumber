"use client";

import { useState } from "react";
import { authApi } from "@/lib/api";

export default function ChangePasswordPage() {
  const [current, setCurrent]         = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg]     = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputCls =
    "w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (newPass.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(current, newPass);
      setMsg("Password changed successfully.");
      setCurrent("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Change Password</h1>
        <p className="text-gray-400 text-sm mt-1">
          Keep your account secure with a strong password.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Current Password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {msg   && <p className="text-green-400 text-xs">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--bg-card-inner)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
