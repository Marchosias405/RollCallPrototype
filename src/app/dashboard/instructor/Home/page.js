"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../utils/supabase/client";

function convertTimeToMinutes(timeStr) {
  timeStr = timeStr.replace(/\s/g, "");
  const match = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/);
  if (!match) return 0;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

export default function InstructorHome() {
  const router = useRouter();
  const currentInstructorId = "inst1";
  
  const [data, setData] = useState([]);       // not used
  const [students, setStudents] = useState([]); // not used 
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { data: attendance },
        { data: studentData },
        { data: courseData },
      ] = await Promise.all([
        supabase.from("attendance").select(""),
        supabase.from("students").select(""),
        supabase.from("courses").select("*"),
      ]);

      setData(attendance || []);
      setStudents(studentData || []);
      setCourses(courseData || []);
    };
    fetchAll();
  }, []);

  // filter for "instr1"
  const filteredCourses = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
    const inst1Courses = courses.filter(
      (course) =>
        course.instructor_ids.includes(currentInstructorId) &&
        course.day === today
    );
  
    return inst1Courses.sort((a, b) => {
      const minutesA = convertTimeToMinutes(a.time);
      const minutesB = convertTimeToMinutes(b.time);
      return minutesA - minutesB;
    });
  }, [courses]);
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Upcoming Classes
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Time
                </th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {course.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {course.day}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {course.time}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/instructor/Attendance/${course.id}`
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
                      >
                        Attendance
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No upcoming classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
