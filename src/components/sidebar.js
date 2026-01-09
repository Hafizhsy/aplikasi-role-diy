"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Sidebar() {
    const { data: session } = useSession();
    const roles = session?.user?.roles || [];

    return (
        <div className="w-64 bg-blue-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-8 border-b pb-4 text-center">Pemda DIY</h2>
      
      <nav className="flex-grow">
        <ul className="space-y-2">
          {/* Menu yang bisa dilihat semua orang yang sudah login */}
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-blue-800 rounded">Dashboard</Link>
          </li>

            {/* Menu untuk admin */}
            {roles.includes("admin") && (
            <li>
                <Link href="/dashboard/manajemen-user" className="block p-2 hover:bg-blue-800 rounded text-yellow-400 font-semibold">Manajemen User</Link>
            </li>
            )}
            </ul>
        </nav>

        <div className="mt-auto pt-4 border-t text-[10px] text-blue-300 text-center">
        &copy; 2026 - Pemda DIY
        </div>  
    </div>
    );
}

