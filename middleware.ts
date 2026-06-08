import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, refreshSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/admin/login";

  let response = NextResponse.next();

  const refreshedSession = await refreshSession(request);
  if (refreshedSession) {
    response.cookies.set("session", refreshedSession, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  const sessionToken = request.cookies.get("session")?.value;
  const session = await getSession(sessionToken);

  if (isAdminRoute && !isLoginRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isLoginRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - assets (images in public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)",
  ],
};
