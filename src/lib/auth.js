const keycloakIssuer = process.env.KEYCLOAK_ISSUER;
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID;
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

export function getKeycloakAdminConfig() {
  const issuer = keycloakIssuer || "http://localhost:8080/realms/pemda";
  const realm = issuer.split("/realms/")[1] || "pemda";
  const origin = issuer.split("/realms/")[0] || "http://localhost:8080";

  return {
    adminBaseUrl:
      process.env.KEYCLOAK_ADMIN_BASE_URL || `${origin}/admin/realms/${realm}`,
    clientUuid: process.env.KEYCLOAK_CLIENT_ID_UUID,
    issuer,
    realm,
  };
}

export function getUserRoles(profile, account) {
  const clientRoles =
    profile?.resource_access?.[keycloakClientId]?.roles ||
    account?.resource_access?.[keycloakClientId]?.roles ||
    [];
  const realmRoles =
    profile?.realm_access?.roles || account?.realm_access?.roles || [];

  const roles = [...new Set([...clientRoles, ...realmRoles])].filter((role) =>
    ["admin", "operator"].includes(role)
  );

  if (roles.includes("admin")) {
    return ["admin"];
  }

  if (roles.includes("operator")) {
    return ["operator"];
  }

  return [];
}

export function getUserWilayah(profile) {
  const wilayah = profile?.wilayah || profile?.attributes?.wilayah;

  if (Array.isArray(wilayah)) {
    return wilayah[0] || "umum";
  }

  return wilayah || "umum";
}

export async function refreshKeycloakAccessToken(token) {
  try {
    const response = await fetch(`${keycloakIssuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: keycloakClientId,
        client_secret: keycloakClientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      id_token: refreshedTokens.id_token ?? token.id_token,
      error: undefined,
    };
  } catch (error) {
    console.error("Gagal refresh access token Keycloak:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
