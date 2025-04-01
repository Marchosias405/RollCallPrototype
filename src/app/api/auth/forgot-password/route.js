import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // we first parse the JSON body to extract email address provided by the user
    const { email } = await req.json();

    // send a POST request to auth0 to change the password
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/dbconnections/change_password`,
      {
        client_id: process.env.AUTH0_CLIENT_ID, // client identifier
        email: email,                           // user's email address
        connection: process.env.AUTH0_CONNECTION_NAME, // database connection
      },
      {
        headers: { "Content-Type": "application/json" }, // sending it in JSON format
      }
    );

    // conformiton that reset email has been sent with 200 OK status
    return NextResponse.json({ message: response.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
