import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getOAuthConfig } from "@/lib/oauth";

export const runtime = "nodejs";

const COOKIE_AGE_SECONDS = 600;

function createLoginRedirect(request, error) {
  const url = new URL("/auth/login", request.nextUrl.origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request, { params }) {
  const { provider } = params;
  const config = getOAuthConfig(provider);
  if (!config) return createLoginRedirect(request, "provider_not_configured");

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const nonce = randomBytes(32).toString("base64url");
  const authorizationUrl = provider === "google"
    ? new URL("https://accounts.google.com/o/oauth2/v2/auth")
    : new URL("https://github.com/login/oauth/authorize");

  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", config.callbackUrl);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", provider === "google" ? "openid email profile" : "read:user user:email");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", challenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  if (provider === "google") {
    authorizationUrl.searchParams.set("nonce", nonce);
    authorizationUrl.searchParams.set("prompt", "select_account");
  }

  const response = NextResponse.redirect(authorizationUrl);
  const secure = process.env.NODE_ENV === "production";
  const cookiePath = `/api/auth/oauth/${provider}/callback`;
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: cookiePath,
    maxAge: COOKIE_AGE_SECONDS,
  };
  response.cookies.set(`oauth-state-${provider}`, state, cookieOptions);
  response.cookies.set(`oauth-verifier-${provider}`, verifier, cookieOptions);
  if (provider === "google") response.cookies.set("oauth-nonce-google", nonce, cookieOptions);

  return response;
}
