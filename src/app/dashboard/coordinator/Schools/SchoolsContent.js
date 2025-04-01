"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../../utils/supabase/client";

export default function SchoolsContent() {
  // ---------- Retrieve Data ----------
  const [schools, setSchools] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { data: schoolData },
        { data: instructorData },
        { data: courseData },
      ] = await Promise.all([
        supabase.from("School").select("*"),
        supabase.from("instructors").select("*"),
        supabase.from("courses").select("*"),
      ]);

      setSchools(schoolData || []);
      setInstructors(instructorData || []);
      setCourses(courseData || []);
    };
    fetchAll();
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilter = searchParams.get("school") || "";
  const [schoolsSearchTerm, setSchoolsSearchTerm] = useState(prefilter);
  // mapping school id to boolean indicating whether its details are expanded
  const [expandedSchools, setExpandedSchools] = useState({});

  // toggle the expansion for a given school
  const toggleSchoolExpansion = (schoolId) => {
    setExpandedSchools((prev) => ({
      ...prev,
      [schoolId]: !prev[schoolId],
    }));
  };

  // navigate to course attendance page
  const handleCourseAttendance = (courseId) => {
    router.push(`/dashboard/coordinator/Courses/${courseId}`);
  };

  // helper to get instructor names for a course
  const getInstructorNames = (instructorId) => {
    if (!instructorId) return "Unknown";
    const instructor = instructors.find((inst) => inst.id === instructorId);
    return instructor ? instructor.name : "Unknown";
  };

  // filter schools based on the search term.
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(schoolsSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Schools</h1>
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search schools..."
            className="p-3 rounded border border-gray-300 w-full focus:outline-none focus:ring focus:border-blue-300"
            value={schoolsSearchTerm}
            onChange={(e) => setSchoolsSearchTerm(e.target.value)}
          />
          {schoolsSearchTerm && (
            <button
              onClick={() => setSchoolsSearchTerm("")}
              className="ml-3 p-3 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              aria-label="Clear search"
            >
              X
            </button>
          )}
        </div>
        <ul className="space-y-4">
          {filteredSchools.map((school) => (
            <li key={school.id} className="p-6 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleSchoolExpansion(school.id)}
                  className="cursor-pointer hover:underline font-semibold text-left w-full text-xl text-gray-800"
                >
                  {school.name}
                </button>
              </div>
              {expandedSchools[school.id] && (
                <div className="mt-4 pl-4 border-l-4 border-blue-500">
                  <h3 className="font-bold mb-3 text-lg">Courses</h3>
                  {school.course_ids && school.course_ids.length > 0 ? (
                    <ul className="space-y-3">
                      {school.course_ids.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        if (!course) return null;
                        return (
                          <li
                            key={course.id}
                            className="p-4 bg-gray-50 rounded flex flex-col"
                          >
                            <div className="font-semibold text-gray-700">
                              {course.name}
                            </div>
                            <div className="text-gray-600">
                              Day: {course.day}
                            </div>
                            <div className="text-gray-600">
                              Time: {course.time}
                            </div>
                            <div className="text-gray-600">
                              Instructors: {getInstructorNames(course.instructor_ids)}
                            </div>
                            <button
                              onClick={() => handleCourseAttendance(course.id)}
                              className="mt-3 self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              View Class List
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      No courses available for this school.
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
          {filteredSchools.length === 0 && (
            <li className="p-6 bg-white rounded-lg shadow text-center text-gray-600">
              No schools found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
