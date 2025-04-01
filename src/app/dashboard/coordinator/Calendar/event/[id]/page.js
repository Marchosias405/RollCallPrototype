"use client";

import { useParams } from "next/navigation";

export default function EventDetails() {
  const { id } = useParams(); // retrieve the event ID from the url

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl text-white font-bold mb-4">Event Details</h1>
        <p className="text-gray-400">Displaying details for event ID: {id}</p>
        { 
          // placeholder: later  can fetch additional attendance data from the database and display the attendance details for this specific event.
        }
      </div>
    </div>
  );
}