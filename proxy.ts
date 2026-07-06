import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Public API routes that don't require authentication
const publicApiRoutes = [
  "/api/profile",
  "/api/statistics",
  "/api/news",
  "/api/officers",
  "/api/potentials",
  "/api/letters/types",
  "/api/letters/requests", // POST for public, GET/PATCH for admin handled in route
  "/api/letters/track",
];

export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = nextUrl.pathname === "/login";

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect Admin Routes
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Protect API Routes
  if (isApiRoute) {
    // Check if the API route is exactly in the public list or matches dynamically
    const isPublicApi = publicApiRoutes.some(
      (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    );

    // Some specific cases
    // POST /api/letters/requests is public
    if (nextUrl.pathname === "/api/letters/requests" && req.method === "POST") {
      return NextResponse.next();
    }
    
    // GET /api/news/[slug] is public
    if (nextUrl.pathname.startsWith("/api/news/") && req.method === "GET") {
      return NextResponse.next();
    }

    // Protect all other routes that are NOT public
    if (!isPublicApi && !isLoggedIn) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    // Protect modifying requests to public APIs (e.g. POST/PUT/DELETE to /api/news)
    const isPublicReadOnly = ["/api/profile", "/api/officers", "/api/potentials", "/api/news"].some(
      (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    );
    if (isPublicReadOnly && req.method !== "GET" && !isLoggedIn) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
