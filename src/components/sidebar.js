"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut  
} from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const roles = session?.user?.roles || [];

  const handleLogout = async () => {
    const idToken = session?.id_token;
    const issuerUrl = "http://localhost:8080/realms/pemda"; 
    const postLogoutUrl = "http://localhost:3000";

    await signOut({ redirect: false });

    if (idToken) {
      window.location.href = `${issuerUrl}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(postLogoutUrl)}`;
    } else {
      // Fallback jika token hilang, langsung ke logout umum
      window.location.href = postLogoutUrl;}
  };

  const menuItems = [
  { name: 'Dashboard Utama', icon: <LayoutDashboard size={18}/>, path: '/dashboard',roles: ['admin', 'operator'] },
  { name: 'Input Laporan', icon: <FileText size={18}/>, path: '/dashboard/input-data', roles: ['admin', 'operator'] },
  { name: 'Manajemen Pengguna', icon: <Users size={18}/>, path: '/dashboard/admin', roles: ['admin'] },
  { name: 'Audit Log Sistem', icon: <ShieldCheck size={18}/>, path: '/dashboard/audit', roles: ['admin'] },
  { name: 'Rekap Laporan', icon: <BarChart3 size={18}/>, path: '/dashboard/rekap', roles: ['admin', 'operator'] },
];
  // const menuItems = [
  //   { name: "Dashboard Utama", href: "/dashboard", icon: "📊", roles: ["admin", "operator"] },
  //   { name: "Input Laporan", href: "/dashboard/input-data", icon: "📝", roles: ["admin", "operator"] },
  //   { name: "Manajemen Pengguna", href: "/dashboard/admin", icon: "👤", roles: ["admin"] },
  //   { name: "Audit Log Sistem", href: "/dashboard/audit", icon: "🛡️", roles: ["admin"] },
  //   { name: "Rekap Laporan", href: "/dashboard/rekap", icon: "📁", roles: ["admin", "operator"] },
  // ];

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

            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}>
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

 <div className="p-4 border-t border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between bg-slate-800/40 p-2 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="w-8 h-8 min-w-[32px] rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {session?.user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-white truncate w-24 leading-tight">
              {session?.user?.name}
            </p>
            <p className="text-[9px] text-blue-400 font-medium uppercase tracking-tighter">
              {roles[0] || "User"}
            </p>
          </div>
        </div>

        {/* TOMBOL LOGOUT SEJAJAR NAMA */}
        <button
          onClick={handleLogout}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all group ml-2"
          title="Keluar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </div>
    </div>
  );
}