"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white overflow-hidden relative">
      
      {/* Background Animated Circles */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute w-72 h-72 bg-cyan-500/20 rounded-full animate-ping-slow blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full animate-ping-slow blur-3xl -bottom-20 -right-20"></div>
      </div>

      {/* Konten Utama */}
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center space-y-8">
        <h1 className="text-6xl font-extrabold text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] animate-pulse">
          MJ Laundry
        </h1>
        <p className="text-xl text-cyan-200 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] max-w-xl mx-auto">
          Selamat datang! Pilih menu Customers atau Orders untuk memulai.
        </p>

        {/* Tombol Neon */}
        <div className="flex flex-col sm:flex-row gap-8">
          <Link href="/customers">
            <button className="px-10 py-4 bg-cyan-500/40 hover:bg-cyan-500/80 rounded-xl font-bold text-2xl text-white drop-shadow-[0_0_25px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_50px_rgba(0,255,255,1)] transition-all duration-300 transform hover:-translate-y-1">
              Customers
            </button>
          </Link>
          <Link href="/orders">
            <button className="px-10 py-4 bg-purple-500/40 hover:bg-purple-500/80 rounded-xl font-bold text-2xl text-white drop-shadow-[0_0_25px_rgba(255,0,255,0.8)] hover:drop-shadow-[0_0_50px_rgba(255,0,255,1)] transition-all duration-300 transform hover:-translate-y-1">
              Orders
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Neon */}
      <footer className="w-full text-center py-4 bg-black/30 border-t border-white/20 text-white/70 drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
        &copy; {new Date().getFullYear()} MJ Laundry. All rights reserved.
      </footer>
    </div>
  );
}
