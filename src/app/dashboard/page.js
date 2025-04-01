import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const token = await cookieStore.get("auth_token");

  if (!token) {
    redirect("/login"); // send to login (if not logged in)
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
