const providers = {
  google: {
    clientId: "GOOGLE_CLIENT_ID",
    clientSecret: "GOOGLE_CLIENT_SECRET",
  },
  github: {
    clientId: "GITHUB_CLIENT_ID",
    clientSecret: "GITHUB_CLIENT_SECRET",
  },
};

export function getOAuthConfig(provider) {
  if (!Object.prototype.hasOwnProperty.call(providers, provider)) return null;
  const names = providers[provider];

  const clientId = process.env[names.clientId];
  const clientSecret = process.env[names.clientSecret];
  if (!clientId || !clientSecret) return null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const callbackUrl = new URL(`/api/auth/oauth/${provider}/callback`, appUrl).toString();
  return { clientId, clientSecret, callbackUrl };
}
