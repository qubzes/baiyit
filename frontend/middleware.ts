import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that require authentication
const protectedRoutes = ["/profile", "/acquisitions", "/sessions", "/hub"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Check for authentication token
  const token = request.cookies.get("access_token")?.value;

  // If trying to access login page while authenticated, redirect to profile
  if (path === "/login" && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // If no token is found and trying to access protected route, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/profile/:path*",
    "/acquisitions/:path*",
    "/sessions/:path*",
    "/hub/:path*",
    "/login",
  ],
};
