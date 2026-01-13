import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Jika user coba akses halaman dashboard yang ada folder /jogja/
    // tapi atribut wilayah di token Keycloak bukan "jogja"
    if (path.startsWith("/dashboard/jogja") && token?.wilayah !== "jogja") {
      // Kita tendang balik ke halaman utama dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // Pastikan user sudah login dulu baru bisa jalanin fungsi di atas
      authorized: ({ token }) => !!token,
    },
  }
);

// Ini untuk mendaftarkan rute mana saja yang mau dijaga "satpam" ini
export const config = { 
  matcher: ["/dashboard/:path*"] 
};