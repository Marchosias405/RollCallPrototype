"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../utils/supabase/client";

export default function AttendanceSheet() {
  const router = useRouter();
  const params = useParams();
  const selectedCourseId = params?.courseId;

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState([]); // attendance records (even if not used)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { data: attendance },
        { data: studentData },
        { data: courseData },
      ] = await Promise.all([
        supabase.from("attendance").select("*"),
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => router.push("/dashboard/coordinator/Schools")}
            className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Schools
          </button>
          <p className="text-center text-gray-700">Course not found.</p>
        </div>
      </div>
    );
  }

  const assignedStudents = selectedCourse.student_ids || [];
  const courseStudents = students.filter((student) =>
    assignedStudents.includes(student.id)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <button
          onClick={() => router.push("/dashboard/coordinator/Schools")}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Back to Schools
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Class List - {selectedCourse.courseCode || selectedCourse.id}
        </h2>

        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Emergency Contact</th>
                <th className="py-3 px-6 text-left">Note</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {courseStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{student.name}</td>
                  <td className="py-3 px-6">
                    {student.emergency_name} : {student.emergency_phone}
                  </td>
                  <td className="py-3 px-6">{student.notes || "—"}</td>
                </tr>
              ))}
              {courseStudents.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">
                    No students found.
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
