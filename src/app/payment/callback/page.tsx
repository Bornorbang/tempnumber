"use client";

/**
 * Standalone payment callback — lives OUTSIDE the dashboard layout so the
 * dashboard auth guard cannot redirect the user to /auth/signin before the
 * payment has been verified.
 */

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Status = "verifying" | "success" | "error";

// ── Inner component (needs Suspense because it uses useSearchParams) ──────────

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const called = useRef(false);

  const [status, setStatus] = useState<Status>("verifying");
  const [amount, setAmount] = useState<number | null>(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setErrMsg("No payment reference found in the URL.");
      setStatus("error");
      return;
    }

    // Read token directly — no AuthContext / layout dependency
    const raw = typeof window !== "undefined" ? localStorage.getItem("tn_token") : null;
    const token = raw && raw !== "undefined" && raw !== "null" ? raw : null;

    fetch("/api/wallet/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ reference }),
    })
      .then(async (res) => {
        let data: { success?: boolean; amount?: number; error?: string } = {};
        try {
          data = await res.json();
        } catch {
          /* non-JSON body — ignore */
        }

        if (!res.ok || !data.success) {
          setErrMsg(
            data.error ??
              `Verification failed. If money was deducted, contact support with reference: ${reference}`
          );
          setStatus("error");
          return;
        }

        if (data.amount) {
          try {
            sessionStorage.setItem("tn_topup_amount", String(data.amount));
          } catch {
            /* ignore */
          }
        }

        setAmount(data.amount ?? null);
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 2000);
      })
      .catch(() => {
        setErrMsg(
          `Network error. If money was deducted, contact support with reference: ${reference}`
        );
        setStatus("error");
      });
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-page, #0a0f1e)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center shadow-lg"
        style={{
          background: "var(--bg-card, #111827)",
          border: "1px solid var(--border-color, rgba(255,255,255,0.08))",
        }}
      >
        {status === "verifying" && (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(142,190,32,0.12)" }}
            >
              <svg
                className="w-7 h-7 animate-spin"
                style={{ color: "#8EBE20" }}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
            <h1
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary, #fff)" }}
            >
              Verifying payment…
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Please wait. Do not close this page.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(142,190,32,0.12)" }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#8EBE20" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary, #fff)" }}
            >
              Payment successful!
            </h1>
            {amount !== null && (
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                <span
                  className="font-semibold"
                  style={{ color: "#8EBE20", fontSize: "1rem" }}
                >
                  ₦{amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>{" "}
                has been added to your wallet.
              </p>
            )}
            <p className="mt-3" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
              Redirecting to dashboard…
            </p>
            <Link
              href="/dashboard"
              className="mt-5 inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl"
              style={{ background: "#8EBE20", color: "#fff", fontSize: "0.875rem" }}
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(239,68,68,0.12)" }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#f87171" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1
              className="text-xl font-bold mb-2"
              style={{ color: "var(--text-primary, #fff)" }}
            >
              Verification failed
            </h1>
            <p className="mb-5" style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              {errMsg}
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="w-full font-semibold py-2.5 rounded-xl"
                style={{ background: "#8EBE20", color: "#fff", fontSize: "0.875rem" }}
              >
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/wallet"
                className="w-full font-semibold py-2.5 rounded-xl"
                style={{
                  background: "var(--bg-card-inner, #1a2235)",
                  color: "var(--text-primary, #fff)",
                  border: "1px solid var(--border-color, rgba(255,255,255,0.08))",
                  fontSize: "0.875rem",
                }}
              >
                Try Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page export (must wrap useSearchParams in Suspense) ───────────────────────

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--bg-page, #0a0f1e)" }}
        >
          <div
            className="w-8 h-8 rounded-full animate-spin border-2"
            style={{ borderColor: "#8EBE20", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
