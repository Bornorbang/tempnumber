"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";

const AVATAR_URL =
  "https://img.magnific.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740&q=80";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName]   = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [infoMsg, setInfoMsg]         = useState("");
  const [infoError, setInfoError]     = useState("");
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); }
  }, [user]);

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoMsg(""); setInfoError("");
    if (!name.trim()) { setInfoError("Name cannot be empty."); return; }
    if (!email.trim()) { setInfoError("Email cannot be empty."); return; }
    setInfoLoading(true);
    try {
      await authApi.updateProfile(name.trim(), email.trim());
      await refreshUser();
      setInfoMsg("Profile updated successfully.");
    } catch (err) {
      setInfoError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setInfoLoading(false);
    }
  }

  const inputCls =
    "w-full bg-[var(--bg-card-inner)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-[var(--text-primary)] text-2xl font-bold">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account information.</p>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <Image src={AVATAR_URL} alt="Avatar" width={56} height={56} className="w-full h-full object-cover" unoptimized />
        </div>
        <div>
          <p className="text-[var(--text-primary)] font-semibold text-base">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
        <h2 className="text-[var(--text-primary)] font-semibold text-sm mb-4">Basic Information</h2>
        <form onSubmit={saveInfo} className="space-y-3">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>

          {infoError && <p className="text-red-400 text-xs">{infoError}</p>}
          {infoMsg   && <p className="text-green-400 text-xs">{infoMsg}</p>}

          <button
            type="submit"
            disabled={infoLoading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {infoLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
