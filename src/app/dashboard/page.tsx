"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import MiniFooter from "@/components/MiniFooter";

export default function DashboardSelectPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-page)]">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-8 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
          Welcome to Temp Number
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Choose the type of phone number you need for your verification.
        </p>
      </div>

      {/* Choice cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">

        {/* USA Numbers */}
        <button
          onClick={() => router.push("/dashboard/usa")}
          className="group flex flex-col items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-green-500 rounded-2xl p-8 text-center transition-all hover:shadow-lg hover:shadow-green-500/10 cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_the_United_States.png"
            alt="USA Flag"
            className="w-20 h-auto rounded-lg shadow-sm object-cover"
          />
          <div>
            <p className="text-[var(--text-primary)] font-bold text-lg group-hover:text-green-500 transition-colors">
              USA Numbers
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Instant USA phone numbers for any service
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 bg-green-500 group-hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Go to USA Numbers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        {/* All Countries */}
        <button
          onClick={() => router.push("/dashboard/global")}
          className="group flex flex-col items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-500 rounded-2xl p-8 text-center transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://png.pngtree.com/png-clipart/20240321/original/pngtree-world-globe-earth-png-image_14650593.png"
            alt="World Globe"
            className="w-16 h-16 object-contain"
          />
          <div>
            <p className="text-[var(--text-primary)] font-bold text-lg group-hover:text-blue-400 transition-colors">
              All Countries
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Numbers from 150+ countries worldwide
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 bg-blue-500 group-hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Go to All Countries
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>

      </div>
      </div>
      <MiniFooter />
    </div>
  );
}