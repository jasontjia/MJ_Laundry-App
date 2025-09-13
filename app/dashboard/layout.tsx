'use client';
import '../globals.css';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiUsers,
  HiShoppingCart,
  HiReceiptTax,
  HiDocumentReport,
  HiMenu,
} from 'react-icons/hi';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HiHome },
  { name: 'Customers', href: '/dashboard/customers', icon: HiUsers },
  { name: 'Orders', href: '/dashboard/orders', icon: HiShoppingCart },
  { name: 'Services', href: '/dashboard/services', icon: HiReceiptTax },
  { name: 'Reports', href: '/dashboard/reports', icon: HiDocumentReport },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside
        className={`bg-gray-800 flex flex-col transition-all ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {sidebarOpen && (
            <span className="text-2xl font-bold text-cyan-400">MJ Laundry</span>
          )}
          <button
            className="text-cyan-300 p-1 hover:bg-gray-700 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-[0_0_15px_cyan]'
                    : 'hover:bg-gray-700 text-gray-300'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-white' : 'text-cyan-300'
                  }`}
                />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}