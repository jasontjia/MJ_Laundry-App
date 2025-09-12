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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="id">
      <body className="flex h-screen bg-gray-900 text-white overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 flex flex-col transition-all duration-300
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
            {sidebarOpen && <span className="text-2xl font-bold text-cyan-400">MJ Laundry</span>}
            <button
              className="text-cyan-300 p-1 hover:bg-gray-700 rounded"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <HiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-4 px-2 space-y-2 overflow-y-auto">
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

          {/* Footer */}
          {sidebarOpen && (
            <footer className="px-4 py-4 text-sm text-gray-400 border-t border-gray-700">
              &copy; {new Date().getFullYear()} MJ Laundry
            </footer>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto">
          {/* Header */}
          <header className="flex justify-between items-center p-6 border-b border-gray-700">
            <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_15px_cyan]">
              MJ Laundry
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-white/70">Admin</span>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 p-6 overflow-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
