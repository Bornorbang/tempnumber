import Link from "next/link";

export default function WhatsAppWidget() {
  return (
    <Link
      href="/dashboard/support"
      aria-label="Open Support Centre"
      className="fixed bottom-24 sm:bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#22c55e" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
      >
        <path d="M16 3C8.82 3 3 8.37 3 15v8.5A2.5 2.5 0 0 0 5.5 26H9v-9H5.7v-2C5.7 9.83 10.31 5.65 16 5.65S26.3 9.83 26.3 15v2H23v9h3.5a2.5 2.5 0 0 0 2.5-2.5V15c0-6.63-5.82-12-13-12zM7 19h2v5H7v-5zm16 0h2v5h-2v-5z" />
      </svg>
    </Link>
  );
}
