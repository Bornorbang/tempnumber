export default function MiniFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-center py-3 border-t border-[var(--border-color)] ${className}`}>
      <p className="text-gray-500 text-[11px]">
        &copy; {new Date().getFullYear()} Temp Number by{" "}
        <a
          href="https://hostingnigeria.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300 transition-colors"
        >
          Hosting Nigeria
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
