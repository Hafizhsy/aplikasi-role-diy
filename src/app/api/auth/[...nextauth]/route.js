import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],

    callbacks: {
    async jwt({ token, account, profile }) {
        if (account && profile) {
            token.id_token = account.id_token;
            token.accessToken = account.access_token;   
            const clientID = process.env.KEYCLOAK_CLIENT_ID;

            // 1. Ambil roles dari berbagai sumber (Client Roles & Account Roles)
            const clientRoles = profile?.resource_access?.[clientID]?.roles || [];
            const accountRoles = account?.roles || [];
            
            // 2. Gabungkan semua role ke dalam satu array
            const allRoles = [...clientRoles, ...accountRoles];

            // 3. HAPUS DUPLIKAT dengan Set, lalu ubah kembali ke Array
            token.roles = [...new Set(allRoles)]; 

            token.wilayah = profile?.wilayah || "umum"; 
        }
        return token;
    },
    async session({ session, token }) {
        session.user.id = token.sub;
        session.id_token = token.id_token;
        session.accessToken = token.accessToken;
        session.user.roles = token.roles || [];
        session.user.wilayah = token.wilayah || "umum";
        return session;
        },
    },
    events: {
    async signOut({ token }) {  
      const issuerUrl = process.env.KEYCLOAK_ISSUER; 
      const logOutUrl = `${issuerUrl}/protocol/openid-connect/logout?id_token_hint=${token.id_token}&post_logout_redirect_uri=${process.env.NEXTAUTH_URL}`;
      
      try {
        await fetch(logOutUrl);
      } catch (e) {
        console.error("Gagal membersihkan sesi Keycloak:", e);
      }
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };