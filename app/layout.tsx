'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  HiHome,
  HiUsers,
  HiShoppingCart,
  HiDocumentReport,
  HiReceiptTax,
  HiMenu,
} from 'react-icons/hi';
import './globals.css';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HiHome },
  { name: 'Customers', href: '/customers', icon: HiUsers },
  { name: 'Orders', href: '/orders', icon: HiShoppingCart },
  { name: 'Services', href: '/services', icon: HiReceiptTax },
  { name: 'Reports', href: '/reports', icon: HiDocumentReport },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // true = expanded

  return (
    <html lang="id">
      <body className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 flex flex-col transition-all duration-300
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          <div className="px-4 py-4 flex justify-between items-center">
            {sidebarOpen && <span className="text-2xl font-bold text-cyan-400">MJ Laundry</span>}
            <button
              className="text-cyan-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <HiMenu className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-2 mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors
                  ${!sidebarOpen ? 'justify-center' : ''}
                `}
              >
                <item.icon className="w-6 h-6 text-cyan-300" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {sidebarOpen && (
            <footer className="px-4 py-4 text-sm text-gray-400 border-t border-gray-700">
              &copy; {new Date().getFullYear()} MJ Laundry
            </footer>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_15px_cyan]">
              MJ Laundry
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Admin</span>
            </div>
          </header>

          {children}
        </main>
      </body>
    </html>
  );
}
