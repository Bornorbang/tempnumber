import Link from "next/link";

export default function MiniFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-center py-3 border-t border-[var(--border-color)] ${className}`}>
      <p className="text-gray-500 text-[11px]">
        &copy; 2026 {" "}
        <Link
          href="/"
          className="underline hover:text-gray-300 transition-colors"
        >
          Temp Number
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
}
