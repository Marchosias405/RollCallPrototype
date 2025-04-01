"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Fixed Nav Bar */}
      <nav className="w-24 bg-gray-800 text-white flex flex-col fixed h-full">
        <div className="p-2 flex justify-center">
          <img
            src="/icons/rollcall.png"
            alt="RollCall Icon"
            className="h-15 w-15"
          />
        </div>
        <div className="flex-grow flex flex-col justify-center items-center space-y-8">
          <button
            onClick={() => {
              setActiveTab("home");
              router.push("/dashboard/coordinator/Home");
            }}
            className={`flex justify-center items-center p-2 ${
              activeTab === "home"
                ? "bg-gray-700 rounded"
                : "hover:bg-gray-700 rounded"
            }`}
            title="Home"
          >
            <img
              src="/icons/home.png"
              alt="Home Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
          <button
            onClick={() => {
              setActiveTab("schools");
              router.push("/dashboard/coordinator/Schools");
            }}
            className={`flex justify-center items-center p-2 ${
              activeTab === "schools"
                ? "bg-gray-700 rounded"
                : "hover:bg-gray-700 rounded"
            }`}
            title="Schools"
          >
            <img
              src="/icons/school.png"
              alt="Schools Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
          <button
            onClick={() => {
              setActiveTab("instructors");
              router.push("/dashboard/coordinator/Instructor");
            }}
            className={`flex justify-center items-center p-2 ${
              activeTab === "instructors"
                ? "bg-gray-700 rounded"
                : "hover:bg-gray-700 rounded"
            }`}
            title="Instructors"
          >
            <img
              src="/icons/teacher.png"
              alt="Instructors Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
          <button
            onClick={() => {
              setActiveTab("calendar");
              router.push("/dashboard/coordinator/Calendar");
            }}
            className={`flex justify-center items-center p-2 ${
              activeTab === "calendar"
                ? "bg-gray-700 rounded"
                : "hover:bg-gray-700 rounded"
            }`}
            title="Calendar"
          >
            <img
              src="/icons/calendar.png"
              alt="Calendar Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
        </div>
        <div className="p-2 flex justify-center">
          <button
            onClick={() => router.push("/api/auth/logout")}
            title="Logout"
            className="flex justify-center items-center p-2 hover:bg-gray-700 rounded"
          >
            <img
              src="/icons/logout.png"
              alt="Logout Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
        </div>
      </nav>

      <div className="flex flex-col flex-grow ml-24 overflow-y-auto">
        <main className="flex-grow bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
