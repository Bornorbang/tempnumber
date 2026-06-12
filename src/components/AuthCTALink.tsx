"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  dashboardPath: string; // e.g. "/dashboard/dedicated"
  label: string;
  className?: string;
}

/**
 * A CTA button that:
 *  - If the user is logged in  → navigates directly to dashboardPath
 *  - If the user is logged out → navigates to /auth/signup?redirect=dashboardPath
 */
export default function AuthCTALink({ dashboardPath, label, className }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  function handleClick() {
    if (!loading && user) {
      router.push(dashboardPath);
    } else {
      router.push(`/auth/signup?redirect=${encodeURIComponent(dashboardPath)}`);
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
