import { NextResponse } from "next/server";

export async function GET(req) {
  const { origin } = req.nextUrl;
  const res = NextResponse.redirect(new URL("/login", origin));

  // clear auth tokens
  res.cookies.set("auth_token", "", { maxAge: 0 });

  return res;
}
