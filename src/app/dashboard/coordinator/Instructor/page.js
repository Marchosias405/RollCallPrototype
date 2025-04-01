"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabase/client";

export default function CoordinatorInstructor() {

    const [instructors, setInstructors] = useState([]);
  
    useEffect(() => {
      const fetchAll = async () => {
        const [
          { data: instructorData },
        ] = await Promise.all([
          supabase.from("instructors").select("*"),
        ]);
        console.log("Fetched instructor data:", instructorData);
        setInstructors(instructorData || []);
      };
      fetchAll();
    }, []);
    // ---------- Instructors States ----------

  const [instructorsSearchTerm, setInstructorsSearchTerm] = useState("");

  const filteredInstructors = instructors.filter((i) =>
    i.name.toLowerCase().includes(instructorsSearchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(instructorsSearchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          Instructors
        </h1>
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search instructors..."
            className="p-3 rounded border border-gray-300 w-full focus:outline-none focus:ring focus:border-blue-300"
            value={instructorsSearchTerm}
            onChange={(e) => setInstructorsSearchTerm(e.target.value)}
          />
          {instructorsSearchTerm && (
            <button
              onClick={() => setInstructorsSearchTerm("")}
              className="ml-3 p-3 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              aria-label="Clear search"
            >
              X
            </button>
          )}
        </div>
        <ul className="space-y-4">
          {filteredInstructors.map((instructor) => (
            <li
              key={instructor.id}
              className="p-6 bg-white rounded-lg shadow flex flex-col"
            >
              <div className="text-xl font-semibold text-gray-800">
                {instructor.name}{" "}
                <span className="text-base text-gray-500">
                  ({instructor.email})
                </span>
              </div>
              <div className="mt-2 text-gray-700">
                Birthdate: {instructor.birthdate}
              </div>
              <div className="mt-1 text-gray-700">
                Address: {instructor.address}
              </div>
              <div className="mt-1 text-gray-700">
                Phone: {instructor.phone}
              </div>
            </li>
          ))}
          {filteredInstructors.length === 0 && (
            <li className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
              No instructors found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
