import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // get access token from auth0
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "password",
        username: email,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email",
      }
    );

    const token = response.data.access_token;

    // fetch user profile using the access token
    const userResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const user = userResponse.data;

    // fetch role from the api
    const managementTokenResponse = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }
    );

    const managementToken = managementTokenResponse.data.access_token;

    // fetch user metadata, including role
    const userMetadataResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
      {
        headers: { Authorization: `Bearer ${managementToken}` },
      }
    );

    const userMetadata = userMetadataResponse.data.app_metadata || {};
    const role = userMetadata.role || "instructor"; // we default to instructor if no role is found

    const res = NextResponse.json({ message: "Login successful", role });

    // then store in cookies
    res.cookies.set("auth_token", token, { httpOnly: true, secure: true });
    res.cookies.set("user_role", role, { httpOnly: true, secure: true });

    return res;
  } catch (error) {
    console.error("❌ Auth0 Error:", error.response?.data || error.message);
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }
}
