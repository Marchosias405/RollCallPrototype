"use client";

import { useState } from "react";

// stores email input, stores success message once reset email is sent, and stores error message if smth goes wrong.
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // handler function triggered when form is submitted
  const handleForgot = async (e) => {
    e.preventDefault(); 
    try {
        // send a POST request to the API route to initate the password reset email
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // sends the user's email as a JSON
      });
      const data = await res.json(); // parse JSON response from API
      // response not OK throw error
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }
      // else success message
      setMessage("If your email exists, you will receive a reset link shortly.");
    } catch (err) {
      setError(err.message);
    }
  };

  // styling!
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* header section */}
        <h1 className="text-3xl font-bold text-white mb-4">Reset Password</h1>
        <p className="text-gray-400 mb-6">
          Enter your email below, and we'll send you a link to reset your password.
        </p>
        {/* form section */}
        <form onSubmit={handleForgot} className="space-y-5">
            {/* email input field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-white bg-gray-700 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           {/* display eror message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* success message */}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          {/* submit button to send the email */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}
