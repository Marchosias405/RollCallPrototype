"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InstructorLayout({ children }) {
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <nav className="w-24 bg-gray-800 text-white flex flex-col">
        <div className="p-2 flex justify-center">
          <img
            src="/icons/rollcall.png"
            alt="RollCall Icon"
            className="h-15 w-15"  
          />
        </div>
        {/* nav icons */}
        <div className="flex-grow flex flex-col justify-center items-center space-y-8">
          <button
            onClick={() => {
              setActiveTab("home");
              router.push("/dashboard/instructor/Home");
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
              setActiveTab("students");
              router.push("/dashboard/instructor/Students");
            }}
            className={`flex justify-center items-center p-2 ${
              activeTab === "students"
                ? "bg-gray-700 rounded"
                : "hover:bg-gray-700 rounded"
            }`}
            title="Students"
          >
            <img
              src="/icons/student.png"
              alt="Students Icon"
              className="h-10 w-10 filter brightness-0 invert"
            />
          </button>
          <button
            onClick={() => {
              setActiveTab("calendar");
              router.push("/dashboard/instructor/Calendar");
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
      <div className="flex flex-col flex-grow">
        <main className="flex-grow bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
