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
        if (account) {
        token.id_token = account.id_token;
        const clientID = process.env.KEYCLOAK_CLIENT_ID;
        const roles = profile?.resource_access?.[clientID]?.roles ||
                    account?.roles || [];
        token.roles = roles; 
        }
        return token;
    },
    async session({ session, token }) {
        // Pindahkan id_token dari 'tiket' ke 'session' agar bisa dibaca di halaman UI
        session.id_token = token.id_token;
        session.user.roles = token.roles || [];
        return session;
    },
    },

}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };