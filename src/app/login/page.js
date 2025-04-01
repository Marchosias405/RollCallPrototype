"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    // variables storing email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // hook for programmatic navigation
  const router = useRouter();

  //function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // prevents default form submission behaviour which refreshes the page
    try {
        // send POST request to auth0
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          // parse response data from server
          const data = await res.json();
          if (!res.ok) {
            throw new Error("Invalid email or password");
          }
          // check what role the user is (coordinator or instructor)
          if (data.role === "coordinator") {
            router.push("/dashboard/coordinator");
          } else {
            router.push("/dashboard/instructor");
          }
    // catches any error and sends message
    } catch (err) {
      setError(err.message);
    }
  };


  const handleGoogleSignIn = () => {
    // TODO: replace with actual google sign in logic
    alert("Google Sign-In clicked!");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 flex">
      {/* left panel */}
      <div className="w-1/2 bg-gray-900 flex items-center justify-center relative z-30">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl text-white font-bold mb-4">Welcome to RollCall</h1>
          <p className="text-gray-400 mb-6">Enter your details to sign in</p>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-white bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-white bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>
          {/* forgot password */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/forgot-password/")}
              className="text-blue-400 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>
          {/* divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-700 w-1/4"></div>
            <span className="px-2 text-gray-400">OR</span>
            <div className="border-t border-gray-700 w-1/4"></div>
          </div>
          <button
          // google sign in button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center text-white bg-gray-800 hover:bg-gray-700 py-3 rounded-md"
          >
          <Image
            src="/google-icon.png" 
            alt="Google Logo"
            width={24} 
            height={24} 
            className="mr-2"
          />
            
            Sign in with Google
          </button>
        </div>
      </div>

      {/* right panel */}
      <div className="absolute right-0 top-0 h-full w-1/2 z-20">
    {/* blue background */}
    <div className="h-full w-full bg-blue-700 rounded-l-3xl shadow-xl relative">
        
        {/* overlayed image */}
        <Image
        src="/welcome-screen-graphic2.svg"
        alt="Welcome Graphic"
        width={600}
        height={600}
        className="absolute inset-0 m-auto object-contain"
        />
    </div>
    </div>
      
    </div>
  );
}
