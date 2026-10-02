import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME, ROLES } from "@/constants";

const JWT_SECRET = process.env.JWT_SECRET;
const secretKey = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

const publicRoutes = [
  "/",
  "/courses",
  "/categories",
  "/instructors",
  "/about",
  "/contact",
  "/pricing",
  "/faq",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/certificate/verify",
];

const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/auth/verify-email"];

const roleProtectedRoutes = {
  [ROLES.STUDENT]: ["/student"],
  [ROLES.INSTRUCTOR]: ["/instructor"],
  [ROLES.ADMIN]: ["/admin"],
  [ROLES.SUPER_ADMIN]: ["/admin"],
};

function startsWithAny(pathname, prefixes) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function verifyTokenFromCookie(token) {
  if (!token || !secretKey) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = await verifyTokenFromCookie(token);

  if (pathname === "/api/auth/login" || pathname === "/api/auth/register" || pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (startsWithAny(pathname, authRoutes)) {
    if (user) {
      const dashboardUrl =
        user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN
          ? "/admin/dashboard"
          : user.role === ROLES.INSTRUCTOR
          ? "/instructor/dashboard"
          : "/student/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  let requiredRoles = [];
  for (const [role, prefixes] of Object.entries(roleProtectedRoutes)) {
    if (startsWithAny(pathname, prefixes)) {
      requiredRoles.push(role);
    }
  }

  if (requiredRoles.length > 0) {
    if (!user) {
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const hasAccess = requiredRoles.includes(user.role);
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|og-image.png).*)",
  ],
};
