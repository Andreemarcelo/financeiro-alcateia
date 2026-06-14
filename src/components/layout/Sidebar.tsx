"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Truck, GitMerge,
  BarChart3, Settings, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",              label: "Dashboard",      icon: LayoutDashboard },
  { href: "/vendas",        label: "Vendas",         icon: ShoppingBag },
  { href: "/fretes",        label: "Fretes Reais",   icon: Truck },
  { href: "/conciliacao",   label: "Conciliação",    icon: GitMerge },
  { href: "/relatorios",    label: "Relatórios",     icon: BarChart3 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Financeiro</p>
            <p className="text-green-400 text-xs font-semibold tracking-wide">ALCATEIA</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-700 pt-3">
        <Link href="/configuracoes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Settings size={17} />
          Configurações
        </Link>
        <div className="mt-3 px-3">
          <p className="text-xs text-gray-600">Alcateia Azul Móveis</p>
          <p className="text-xs text-gray-600">v1.0 · Modo demo</p>
        </div>
      </div>
    </aside>
  );
}
