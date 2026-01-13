"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const roles = session?.user?.roles || [];

  const menuItems = [
    { name: "Dashboard Utama", href: "/dashboard", icon: "📊", roles: ["admin", "operator"] },
    { name: "Input Laporan", href: "/dashboard/input-data", icon: "📝", roles: ["admin", "operator"] },
    { name: "Manajemen Pengguna", href: "/dashboard/admin", icon: "👤", roles: ["admin"] },
    { name: "Audit Log Sistem", href: "/dashboard/audit", icon: "🛡️", roles: ["admin"] },
    { name: "Rekap Laporan", href: "/dashboard/rekap", icon: "📁", roles: ["admin", "operator"] },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen p-0 flex flex-col shadow-xl">
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white tracking-wider">E-GOV DIY</h2>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Sistem Terintegrasi</p>
      </div>
      
      <nav className="flex-grow p-4 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Cek apakah user punya role yang diizinkan untuk menu ini
            const hasAccess = item.roles.some(role => roles.includes(role));
            if (!hasAccess) return null;

            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
            {session?.user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate capitalize">{roles[0] || "User"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}