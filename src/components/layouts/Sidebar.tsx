"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebarStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Wrench,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Shield,
} from "lucide-react";

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string; icon?: React.ElementType }[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Ingresos",
    icon: TrendingUp,
    subItems: [
      { name: "Notas de Recepción", href: "/nota-recepcion", icon: TrendingUp },
      { name: "Notas de Entrega", href: "/nota-entrega", icon: TrendingUp },
    ],
  },
  { name: "Egresos", href: "/egreso", icon: TrendingDown },
  { name: "Clientes", href: "/cliente", icon: Users },
  { name: "Productos", href: "/producto", icon: Package },
  { name: "Servicios", href: "/servicio", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  }, [pathname, closeSidebar]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  const isActive = (href: string) => pathname === href;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-primary-700 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Firext Ventas</span>
      </div>

      {/* Menú */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-primary-700 ${
                    openDropdown === item.name ? "bg-primary-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {openDropdown === item.name ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <AnimatePresence>
                  {openDropdown === item.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-primary-800/50 py-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-primary-700 ${
                              isActive(sub.href) ? "bg-primary-700" : ""
                            }`}
                          >
                            <sub.icon className="w-4 h-4 ml-5" />
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary-700 ${
                  isActive(item.href!) ? "bg-primary-700" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer: Perfil y Cerrar sesión */}
      <div className="border-t border-primary-700 p-4 space-y-2">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-xs text-primary-200">@{user?.username}</p>
          </div>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-primary-700 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar para desktop (siempre visible) */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-primary text-white flex-col z-40 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Sidebar móvil (colapsable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-64 bg-primary text-white z-50 shadow-xl flex flex-col md:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
