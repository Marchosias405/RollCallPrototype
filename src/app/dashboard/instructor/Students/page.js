"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../utils/supabase/client";

export default function InstructorStudents() {
  const currentInstructorId = "inst1";

  const [data, setData] = useState([]); // not used
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch from supabase
  useEffect(() => {
    const fetchAll = async () => {
      const [
        { data: attendance },
        { data: studentData },
        { data: courseData },
      ] = await Promise.all([
        supabase.from("attendance").select(""),
        supabase.from("students").select("*"),
        supabase.from("courses").select("*"),
      ]);
      setData(attendance || []);
      setStudents(studentData || []);
      setCourses(courseData || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // filter courses taught by the instructor
  const coursesTaught = useMemo(() => {
    return courses.filter((course) =>
      course.instructor_ids.includes(currentInstructorId)
    );
  }, [courses, currentInstructorId]);

  const courseIds = useMemo(
    () => coursesTaught.map((course) => course.id),
    [coursesTaught]
  );

  // filter students enrolled in those courses
  const filteredStudents = useMemo(() => {
    return students.filter((student) => courseIds.includes(student.course_id));
  }, [students, courseIds]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  // CHANGED: Define getCourseDetails only once
  const getCourseDetails = (courseId) => {
    return courses.find((course) => course.id === courseId);
  };

  // CHANGED: If data is still loading, render a skeleton loader.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Skeleton for page heading */}
          <div className="h-10 bg-gray-300 rounded animate-pulse mb-6 w-1/2"></div>
          {/* Skeleton for table header and rows */}
          <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="h-8 bg-gray-300 rounded animate-pulse w-16"></div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Students</h1>
        <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Student Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Student ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Course ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {student.id}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      {student.course_id}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
                      >
                        View Details
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
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Student Details</h2>
              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>
              <p>
                <strong>ID:</strong> {selectedStudent.id}
              </p>
              <p>
                <strong>Course ID:</strong> {selectedStudent.course_id}
              </p>
              {(() => {
                const course = getCourseDetails(selectedStudent.course_id);
                if (course) {
                  return (
                    <>
                      <p>
                        <strong>Course Name:</strong> {course.name}
                      </p>
                      <p>
                        <strong>School:</strong> {course.school_id}
                      </p>
                    </>
                  );
                }
                return null;
              })()}
              {selectedStudent.emergency_contact ? (
                <p>
                  <strong>Emergency Contact:</strong>{" "}
                  {selectedStudent.emergency_contact.name} -{" "}
                  {selectedStudent.emergency_contact.phone}
                </p>
              ) : (
                <p>
                  <strong>Emergency Contact:</strong> N/A
                </p>
              )}
              {selectedStudent.notes && (
                <p>
                  <strong>Allergies / Notes:</strong> {selectedStudent.notes}
                </p>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
