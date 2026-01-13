import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { useCallback } from "react";

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
        session.id_token = token.id_token;
        session.user.roles = token.roles || [];
        session.user.wilayah = token.wilayah || "umum";
        return session;
        },
    },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };