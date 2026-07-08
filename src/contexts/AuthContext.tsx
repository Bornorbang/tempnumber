"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, ApiError, type User } from "@/lib/api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem("tn_token");
    // Reject missing or corrupted tokens (e.g. the literal string "undefined")
    if (!stored || stored === "undefined" || stored === "null") {
      localStorage.removeItem("tn_token");
      localStorage.removeItem("tn_user");
      setLoading(false);
      return;
    }
    // Show cached user immediately while re-validating (avoids flicker/redirect)
    const cached = localStorage.getItem("tn_user");
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch { /* ignore bad cache */ }
    }
    try {
      const me = await authApi.me();
      setUser(me);
      localStorage.setItem("tn_user", JSON.stringify(me));
    } catch (err) {
      // Only evict session on an explicit 401 from the server.
      // Network errors (XAMPP down, slow connection) must NOT log the user out —
      // the cached user is preserved so the dashboard stays accessible.
      const isAuthError = err instanceof ApiError && err.status === 401;
      if (isAuthError) {
        localStorage.removeItem("tn_token");
        localStorage.removeItem("tn_user");
        setUser(null);
      }
      // For any other error: if there is a cached user they remain set (set above);
      // if there is no cache, user stays null and loading becomes false → redirect
      // to signin, but the token is preserved for the next page load attempt.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    if (!res.token || !res.user) {
      throw new Error("Invalid response from server. Please try again.");
    }
    localStorage.setItem("tn_token", res.token);
    localStorage.setItem("tn_user", JSON.stringify(res.user));
    setUser(res.user);
  }

  async function register(name: string, email: string, password: string, referralCode?: string) {
    const res = await authApi.register(name, email, password, referralCode);
    if (!res.token || !res.user) {
      throw new Error("Invalid response from server. Please try again.");
    }
    localStorage.setItem("tn_token", res.token);
    localStorage.setItem("tn_user", JSON.stringify(res.user));
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem("tn_token");
    localStorage.removeItem("tn_user");
    setUser(null);
    router.push("/auth/signin");
  }

  async function loginWithGoogle(idToken: string) {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });
    const text = await res.text();
    let data: { token?: string; user?: User; error?: string } = {};
    try { data = JSON.parse(text); } catch { /* empty */ }
    if (!res.ok) throw new Error(data.error ?? "Google sign-in failed");
    if (!data.token || !data.user) throw new Error("Invalid response from server.");
    localStorage.setItem("tn_token", data.token);
    localStorage.setItem("tn_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function refreshUser() {
    try {
      const me = await authApi.me();
      setUser(me);
      localStorage.setItem("tn_user", JSON.stringify(me));
    } catch {
      /* ignore — keep existing user state */
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
