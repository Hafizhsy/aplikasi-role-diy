import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import {
    getUserRoles,
    getUserWilayah,
    refreshKeycloakAccessToken,
} from "@/lib/auth";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
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
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.accessTokenExpires = account.expires_at
                ? account.expires_at * 1000
                : Date.now() + Number(account.expires_in || 0) * 1000;
            token.roles = getUserRoles(profile, account);
            token.wilayah = getUserWilayah(profile);
        }

        if (Date.now() < (token.accessTokenExpires || 0) - 60_000) {
            return token;
        }

        if (token.refreshToken) {
            return refreshKeycloakAccessToken(token);
        }

        return token;
    },
    async session({ session, token }) {
        session.user.id = token.sub;
        session.id_token = token.id_token;
        session.accessToken = token.accessToken;
        session.error = token.error;
        session.user.roles = token.roles || [];
        session.user.wilayah = token.wilayah || "umum";
        return session;
        },
    },
    events: {
    async signOut({ token }) {  
      const issuerUrl = process.env.KEYCLOAK_ISSUER; 
      const logOutUrl = `${issuerUrl}/protocol/openid-connect/logout?id_token_hint=${token.id_token}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL)}`;
      
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
