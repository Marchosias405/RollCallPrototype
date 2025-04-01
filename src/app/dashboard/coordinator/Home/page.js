"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase/client";

export default function CoordinatorHome() {
  // ---------- Supabase Data (Home Tab) ----------
  const [data, setData] = useState([]); // attendance records
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // ---------- Common States ----------
  const [activeTab, setActiveTab] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // ---------- Sorting States ----------
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // ---------- Retrieve Date ----------
  const optionsDate = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const datePST = new Date().toLocaleDateString("en-US", optionsDate);
  const [month, day, year] = datePST.split("/");
  const todayDate = `${year}-${month}-${day}`;
  const todayDayName = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
  });

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
    };
    fetchAll();
  }, []);

  // ---------- Attendance Check ----------
  const isAttendanceComplete = (courseId) => {
    const enrolledStudents = students.filter(
      (student) => student.course_id === courseId
    );
    const todayRecords = data.filter(
      (record) => record.course_id === courseId && record.date === todayDate
    );
    return todayRecords.length === enrolledStudents.length;
  };

  // ---------- Filter courses happening today ----------
  const todaysCourses = courses.filter((course) => {
    // Ensure the course is scheduled for today
    if (course.day?.toLowerCase() !== todayDayName.toLowerCase()) return false;
    // If no search term, include all today's courses
    if (searchTerm.trim() === "") return true;

    const lowerSearchTerm = searchTerm.toLowerCase();
    const courseIdStr = String(course.id).toLowerCase();
    const courseDayStr = course.day ? course.day.toLowerCase() : "";
    const courseTimeStr = course.time ? course.time.toLowerCase() : "";
    const attendanceStatus = isAttendanceComplete(course.id)
      ? "marked"
      : "not marked";

    return (
      courseIdStr.includes(lowerSearchTerm) ||
      courseDayStr.includes(lowerSearchTerm) ||
      courseTimeStr.includes(lowerSearchTerm) ||
      attendanceStatus.includes(lowerSearchTerm)
    );
  });

  // ---------- Sort the columns ----------
  const sortedCourses = sortColumn
    ? [...todaysCourses].sort((a, b) => {
        const aValue = a[sortColumn] ? a[sortColumn].toString() : "";
        const bValue = b[sortColumn] ? b[sortColumn].toString() : "";
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      })
    : todaysCourses;

  // Toggle sort column and direction
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // ---------- Get students of selected course ----------
  const getStudentsForCourse = (courseId) => {
    return students.filter((student) => student.course_id === courseId);
  };

  // ---------- Render the attendance table view ----------
  const renderAttendanceList = () => (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search attendance..."
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th
                onClick={() => handleSort("id")}
                className="py-3 px-6 text-left cursor-pointer"
              >
                School{" "}
                {sortColumn === "id" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="py-3 px-6 text-left">Day</th>
              <th
                onClick={() => handleSort("time")}
                className="py-3 px-6 text-left cursor-pointer"
              >
                Time{" "}
                {sortColumn === "time" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th className="py-3 px-6 text-left">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedCourses.map((course) => (
              <tr
                key={course.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                 {course.id}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {course.day}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {course.time}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <button
                    className={`px-4 py-2 rounded text-white ${
                      isAttendanceComplete(course.id) ? "bg-green-500" : "bg-red-500"
                    }`}
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    {isAttendanceComplete(course.id) ? "Marked" : "Not Marked"}
                  </button>
                </td>

                </td>
              </tr>
            ))}

            {todaysCourses.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  // ---------- Render the detailed attendance view ----------
  const renderAttendanceDetails = () => (
    <>
      <button
        onClick={() => setSelectedCourseId(null)}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700"
      >
        Back to Home
      </button>
      <h2 className="text-2xl font-bold mb-6">
        Attendance Sheet - {selectedCourseId}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Emergency Contact</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {getStudentsForCourse(selectedCourseId).map((student) => {
              const attendanceRecord = data.find(
                (record) =>
                  record.course_id === selectedCourseId &&
                  record.student_id === student.id &&
                  record.date === todayDate
              );

              const status = attendanceRecord?.status || "Not Recorded";

              return (
                <tr key={student.id} className="border-b border-gray-200">
                  <td className="py-3 px-6">{student.name}</td>
                  <td className="py-3 px-6">
                    {student.emergency_name} : {student.emergency_phone}
                  </td>
                  <td className="py-3 px-6 capitalize">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        status === "present"
                          ? "bg-green-500"
                          : status === "absent"
                          ? "bg-red-500"
                          : status === "late"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Home</h1>
        {selectedCourseId ? renderAttendanceDetails() : renderAttendanceList()}
      </div>
    </div>
  );
}
