// middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create standard internationalization middleware
const intlMiddleware = createMiddleware({
  // The list of available locales
  locales: locales,
  // Define the default locale to use when none is selected
  defaultLocale: "en",
  // Automatically detect the locale based on request headers and cookies
  localeDetection: true,
  // Define locale prefix strategy (always include locale prefix in URL)
  localePrefix: "always",
});

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Process internationalization
  const response = intlMiddleware(request);

  if (request.method === "GET") {
    // if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/dashboard") {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/dashboard";
    //   return NextResponse.redirect(url);
    // }

    if (response) {
      return response;
    }
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
    "/:locale/dashboard",
    "/:locale/dashboard/:path*",
    "/:locale/landing",
    "/:locale/landing/:path*",
    "/:locale/settings",
    "/:locale/documents",
    "/:locale/documents/:path*",
  ],
};
