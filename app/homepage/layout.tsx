'use client';
import '../globals.css';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
