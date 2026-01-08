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
                token.roles = profile.resource_access?.[process.env.KEYCLOAK_CLIENT_ID]?.roles || [];
            }
            return token;
        },
        async session({ session, token }) {
            session.user.roles = token.roles;
            return session;
        },
    },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };