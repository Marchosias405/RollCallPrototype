import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("user_role")?.value;

  const url = req.nextUrl.pathname;

  // if no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // restrict access based on role
  if (url.startsWith("/dashboard/instructor") && role !== "instructor") {
    return NextResponse.redirect(new URL("/dashboard/coordinator", req.url));
  }

  if (url.startsWith("/dashboard/coordinator") && role !== "coordinator") {
    return NextResponse.redirect(new URL("/dashboard/instructor", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/instructor/:path*", "/dashboard/coordinator/:path*"],
};
