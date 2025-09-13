'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      {/* Content utama */}
      <div className="flex flex-col justify-center items-center flex-grow">
        <h1 className="text-6xl font-extrabold text-cyan-400 drop-shadow-lg animate-pulse">
          MJ Laundry
        </h1>
        <p className="text-xl text-cyan-200 mt-4 text-center max-w-xl">
          Selamat datang di aplikasi internal MJ Laundry.  
          Gunakan tombol di bawah untuk masuk ke dashboard.
        </p>
        <Link href="/dashboard">
          <button className="mt-8 px-10 py-4 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-700 transition shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            Masuk ke Dashboard
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} MJ Laundry — Internal Use Only
      </footer>
    </div>
  );
}
