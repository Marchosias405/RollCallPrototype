import { NextResponse } from "next/server";

export async function GET(req) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // TODO: to deploy change this
  const res = NextResponse.redirect(new URL("/login", baseUrl));

  // clear auth tokens
  res.cookies.set("auth_token", "", { maxAge: 0 });

  return res;
}
