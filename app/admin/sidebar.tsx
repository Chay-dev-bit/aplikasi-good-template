
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: "⌂" },
  { label: "Kelola Template", href: "/admin/templates", icon: "▤" },
  { label: "Kategori", href: "/admin/categories", icon: "▦" },
  { label: "Pengguna", href: "/admin/users", icon: "♙" },
  { label: "Transaksi", href: "/admin/transactions", icon: "▣" },
  { label: "Laporan Penjualan", href: "/admin/reports", icon: "▥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col bg-[#0b1c2c] text-white md:min-h-screen md:w-64 md:shrink-0">
      <div className="border-b border-white/10 px-6 py-7">
        <Link
          href="/admin"
          className="text-2xl font-bold tracking-tight"
        >
          Good<span className="text-sky-400">Template</span>
        </Link>

        <p className="mt-2 text-xs text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Menu Utama
        </p>

        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-sky-500 font-semibold text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-lg">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <span className="w-5 text-center">←</span>
          Kembali ke Marketplace
        </Link>
      </div>
    </aside>
  );
}
