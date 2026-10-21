import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function assertJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const error = new Error("JWT_SECRET is not configured. Add it to .env.local to enable authentication.");
    error.code = "JWT_SECRET_MISSING";
    throw error;
  }
  return new TextEncoder().encode(jwtSecret);
}

function parseExpiresIn(expiresIn) {
  const match = expiresIn.match(/^(\d+)([smhdwy])$/);
  if (!match) return 7 * 86400;
  const value = parseInt(match[1]);
  const unit = match[2];
  const secondsMap = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, y: 31536000 };
  return value * secondsMap[unit];
}

export function getTokenMaxAge() {
  return parseExpiresIn(JWT_EXPIRES_IN);
}

export async function createToken(payload) {
  const secretKey = assertJwtSecret();
  const expSeconds = parseExpiresIn(JWT_EXPIRES_IN);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expSeconds)
    .sign(secretKey);
}

export async function verifyToken(token) {
  try {
    const secretKey = assertJwtSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(payload) {
  const token = await createToken(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getTokenMaxAge(),
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    const err = new Error("Authentication required");
    err.statusCode = 401;
    throw err;
  }
  return user;
}

export async function requireRole(allowedRoles) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    const err = new Error("Insufficient permissions");
    err.statusCode = 403;
    throw err;
  }
  return user;
}
