import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/profile", "/favorites"];
const OWNER_PATHS = ["/my-rooms"];
const ADMIN_PATHS = ["/admin"];
const GUEST_ONLY_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshCookie = request.cookies.has("refresh_token");

  const isProtected =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    OWNER_PATHS.some((p) => pathname.startsWith(p)) ||
    ADMIN_PATHS.some((p) => pathname.startsWith(p));

  const isGuestOnly = GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !hasRefreshCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && hasRefreshCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
