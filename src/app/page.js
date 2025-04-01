"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded"
      >
        Login
      </button>
    </div>
  );
}
