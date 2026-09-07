"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BoostNav() {
  const pathname = usePathname();
  return <div className="flex gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1">
    {[['New order', '/boost-account/new-order'], ['Orders', '/boost-account/orders']].map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-4 py-2 text-[13px] font-medium ${pathname === href ? 'bg-green-500 text-white' : 'text-[var(--text-secondary)] hover:text-green-500'}`}>{label}</Link>)}
  </div>;
}
