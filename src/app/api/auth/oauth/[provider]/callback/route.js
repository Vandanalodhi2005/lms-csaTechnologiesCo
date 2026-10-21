import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { createToken, getTokenMaxAge, assertJwtSecret } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { COOKIE_NAME, ROLES } from "@/constants";
import { getOAuthConfig } from "@/lib/oauth";

export const runtime = "nodejs";

const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function loginRedirect(request, error) {
  const url = new URL("/auth/login", request.nextUrl.origin);
  if (error) url.searchParams.set("error", error);
  return url;
}

function clearOAuthCookies(response, provider) {
  const path = `/api/auth/oauth/${provider}/callback`;
  for (const suffix of ["state", "verifier", ...(provider === "google" ? ["nonce"] : [])]) {
    response.cookies.set(`oauth-${suffix}-${provider}`, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path,
      maxAge: 0,
    });
  }
}

async function exchangeCode(provider, code, verifier, config) {
  const tokenUrl = provider === "google"
    ? "https://oauth2.googleapis.com/token"
    : "https://github.com/login/oauth/access_token";
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.callbackUrl,
    code_verifier: verifier,
  });
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });
  const result = await response.json();
  if (
    !response.ok ||
    result.error ||
    (provider === "github" && !result.access_token) ||
    (provider === "google" && !result.id_token)
  ) {
    throw new Error("OAuth token exchange failed");
  }
  return result;
}

async function getProviderIdentity(provider, tokens, nonce, config) {
  if (provider === "google") {
    const { payload } = await jwtVerify(tokens.id_token, googleKeys, {
      algorithms: ["RS256"],
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: config.clientId,
    });
    if (payload.nonce !== nonce || payload.email_verified !== true || typeof payload.sub !== "string" || typeof payload.email !== "string") {
      throw new Error("Google account did not provide a verified email");
    }
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      avatar: typeof payload.picture === "string" && payload.picture.startsWith("https://") ? payload.picture : null,
    };
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${tokens.access_token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const [userResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", { headers, cache: "no-store" }),
    fetch("https://api.github.com/user/emails", { headers, cache: "no-store" }),
  ]);
  if (!userResponse.ok || !emailsResponse.ok) throw new Error("GitHub profile lookup failed");

  const [profile, emails] = await Promise.all([userResponse.json(), emailsResponse.json()]);
  const verifiedEmail = emails.find((email) => email.primary && email.verified) || emails.find((email) => email.verified);
  if (!verifiedEmail?.email || !profile.id) throw new Error("GitHub account did not provide a verified email");

  return {
    id: String(profile.id),
    email: verifiedEmail.email,
    name: typeof profile.name === "string" && profile.name.trim()
      ? profile.name
      : typeof profile.login === "string" ? profile.login : "",
    avatar: typeof profile.avatar_url === "string" && profile.avatar_url.startsWith("https://") ? profile.avatar_url : null,
  };
}

async function findOrCreateUser(provider, identity) {
  const providerField = `${provider}Id`;
  const email = identity.email.trim().toLowerCase();
  let user = await User.findOne({ [providerField]: identity.id }).select(`+${providerField}`);

  if (user && user.email !== email) {
    throw new Error("The linked provider email does not match the account");
  }

  if (!user) {
    user = await User.findOne({ email }).select(`+${providerField}`);
    if (user?.[providerField] && user[providerField] !== identity.id) {
      throw new Error("This email is already linked to a different provider account");
    }
  }

  if (!user) {
    const name = identity.name.trim().length >= 2 ? identity.name.trim() : email.split("@")[0];
    user = new User({
      name: name.length >= 2 ? name : "Learner",
      email,
      passwordHash: null,
      [providerField]: identity.id,
      avatar: identity.avatar,
      role: ROLES.STUDENT,
      isEmailVerified: true,
      isActive: true,
    });
  } else {
    user[providerField] = identity.id;
    user.isEmailVerified = true;
    if (!user.avatar && identity.avatar) user.avatar = identity.avatar;
  }

  if (!user.isActive) throw new Error("This account has been deactivated");
  user.lastLoginAt = new Date();

  try {
    await user.save();
  } catch (error) {
    if (error.code !== 11000) throw error;
    user = await User.findOne({ $or: [{ [providerField]: identity.id }, { email }] }).select(`+${providerField}`);
    if (!user || (user[providerField] && user[providerField] !== identity.id)) {
      throw new Error("This email is already linked to another account");
    }
    user[providerField] = identity.id;
    user.isEmailVerified = true;
    user.lastLoginAt = new Date();
    await user.save();
  }

  return user;
}

export async function GET(request, { params }) {
  const { provider } = params;
  const config = getOAuthConfig(provider);
  if (!config) return NextResponse.redirect(loginRedirect(request, "provider_not_configured"));

  const responseError = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const cookieState = request.cookies.get(`oauth-state-${provider}`)?.value;
  const verifier = request.cookies.get(`oauth-verifier-${provider}`)?.value;
  const nonce = request.cookies.get("oauth-nonce-google")?.value;

  if (responseError || !state || !cookieState || state !== cookieState || !code || !verifier || (provider === "google" && !nonce)) {
    const response = NextResponse.redirect(loginRedirect(request, responseError ? "oauth_cancelled" : "oauth_invalid_state"));
    clearOAuthCookies(response, provider);
    return response;
  }

  try {
    assertJwtSecret();
    await dbConnect();
    const tokens = await exchangeCode(provider, code, verifier, config);
    const identity = await getProviderIdentity(provider, tokens, nonce, config);
    const user = await findOrCreateUser(provider, identity);
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };
    const token = await createToken(payload);
    const destination = user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN
      ? "/admin/dashboard"
      : user.role === ROLES.INSTRUCTOR
      ? "/instructor/dashboard"
      : "/student/dashboard";
    const response = NextResponse.redirect(new URL(destination, request.nextUrl.origin));
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getTokenMaxAge(),
    });
    clearOAuthCookies(response, provider);
    return response;
  } catch (error) {
    const errorCode = error.code === "MONGODB_URI_MISSING" || error.code === "JWT_SECRET_MISSING"
      ? "backend_not_configured"
      : "oauth_failed";
    console.error(`[OAuth] ${provider} callback failed: ${error.code || error.name || "unknown error"}`);
    const response = NextResponse.redirect(loginRedirect(request, errorCode));
    clearOAuthCookies(response, provider);
    return response;
  }
}
