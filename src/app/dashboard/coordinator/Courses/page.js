"use client";

import { useState } from "react";
import initialSchools from "../../../../data/schools.json";
import initialInstructors from "../../../../data/instructors.json";
import initialStudents from "../../../../data/students.json";

export default function CoordinatorCourses() {
    // ---------- Courses States ----------
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "CS101",
      assignedSchool: null,
      assignedStudents: [],
      assignedInstructors: []
    }
  ]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // ---------- Schools States ----------
  const [schoolsData, setSchoolsData] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolsSearchTerm, setSchoolsSearchTerm] = useState("");

    // ---------- Courses Functions ----------
  const updateCourse = (updatedCourse) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    setSelectedCourse(updatedCourse);
  };

  // ---------- Instructors States ----------
  const [instructors, setInstructors] = useState(initialInstructors);
  const [instructorsSearchTerm, setInstructorsSearchTerm] = useState("");

  // ---------- Students Data (mapped by school id) ----------
  const [schoolStudents, setSchoolStudents] = useState(initialStudents);

  const handleAddCourse = () => {
    const courseCode = prompt("Enter course code:");
    if (courseCode) {
      const newId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
      const newCourse = {
        id: newId,
        courseCode,
        assignedSchool: null,
        assignedStudents: [],
        assignedInstructors: []
      };
      setCourses([...courses, newCourse]);
    }
  };

  const handleEditCourse = (course) => {
    const newCourseCode = prompt("Edit course code:", course.courseCode);
    if (newCourseCode && newCourseCode !== course.courseCode) {
      updateCourse({ ...course, courseCode: newCourseCode });
    }
  };

  const handleRemoveCourse = (courseId) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse(null);
    }
  };

  const handleAssignSchool = (course) => {
    // Use schoolsData for the list
    const schoolListStr = schoolsData.map((s) => `${s.id}: ${s.name}`).join("\n");
    const input = prompt(`Enter school ID to assign:\n${schoolListStr}`);
    const schoolId = parseInt(input, 10);
    if (!isNaN(schoolId) && schoolsData.find((s) => s.id === schoolId)) {
      updateCourse({ ...course, assignedSchool: schoolId, assignedStudents: [] });
    } else {
      alert("Invalid school ID.");
    }
  };

  const handleToggleStudentAssignment = (course, studentId) => {
    let updatedStudents;
    if (course.assignedStudents.includes(studentId)) {
      updatedStudents = course.assignedStudents.filter((id) => id !== studentId);
    } else {
      updatedStudents = [...course.assignedStudents, studentId];
    }
    updateCourse({ ...course, assignedStudents: updatedStudents });
  };

  // New: Toggle instructor assignment for the course
  const handleToggleInstructorAssignment = (course, instructorId) => {
    let updatedInstructors;
    if (course.assignedInstructors.includes(instructorId)) {
      updatedInstructors = course.assignedInstructors.filter((id) => id !== instructorId);
    } else {
      updatedInstructors = [...course.assignedInstructors, instructorId];
    }
    updateCourse({ ...course, assignedInstructors: updatedInstructors });
  };

  const renderCourseDetails = () => {
    if (!selectedCourse) return null;
    const assignedSchoolObj = schoolsData.find((s) => s.id === selectedCourse.assignedSchool);
    const studentsForSchool = selectedCourse.assignedSchool
      ? (schoolStudents[selectedCourse.assignedSchool] || [])
      : [];
    return (
      <div className="p-4">
        <button onClick={() => setSelectedCourse(null)} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded">
          Back to Course List
        </button>
        <h2 className="text-2xl font-bold mb-4">Course Details - {selectedCourse.courseCode}</h2>
        <div className="mb-4">
          <button onClick={() => handleEditCourse(selectedCourse)} className="px-4 py-2 bg-green-600 text-white rounded mr-2">
            Edit Course Code
          </button>
          {selectedCourse.assignedSchool ? (
            <button onClick={() => handleAssignSchool(selectedCourse)} className="px-4 py-2 bg-blue-600 text-white rounded">
              Change Assigned School
            </button>
          ) : (
            <button onClick={() => handleAssignSchool(selectedCourse)} className="px-4 py-2 bg-blue-600 text-white rounded">
              Assign School
            </button>
          )}
        </div>
        {selectedCourse.assignedSchool && (
          <div className="mb-4">
            <h3 className="text-xl font-bold">Assigned School: {assignedSchoolObj ? assignedSchoolObj.name : "N/A"}</h3>
          </div>
        )}
        {selectedCourse.assignedSchool && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Students in {assignedSchoolObj ? assignedSchoolObj.name : "the school"}:</h3>
            {studentsForSchool.length > 0 ? (
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Student Name</th>
                    <th className="py-3 px-6 text-left">Course Assignment</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {studentsForSchool.map((student) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStudentAssignment(selectedCourse, student.id)}
                          className={`px-4 py-2 rounded text-white ${
                            selectedCourse.assignedStudents.includes(student.id)
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {selectedCourse.assignedStudents.includes(student.id)
                            ? "Remove from Course"
                            : "Add to Course"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students found for this school.</p>
            )}
          </div>
        )}
        {/* Instructors Assignment Section */}
        <div>
          <h3 className="text-xl font-bold mb-2">Instructors for this Course:</h3>
          {instructors.length > 0 ? (
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Instructor Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{instructor.name}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{instructor.email}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleToggleInstructorAssignment(selectedCourse, instructor.id)}
                        className={`px-4 py-2 rounded text-white ${
                          selectedCourse.assignedInstructors.includes(instructor.id)
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {selectedCourse.assignedInstructors.includes(instructor.id)
                          ? "Remove Instructor"
                          : "Add Instructor"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No instructors available.</p>
          )}
        </div>
      </div>
    );
  };

  const renderCourseList = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Courses</h2>
        <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Course
        </button>
      </div>
      <ul className="space-y-2">
        {courses.map((course) => {
          const assignedSchoolObj = schoolsData.find((s) => s.id === course.assignedSchool);
          return (
            <li
              key={course.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div onClick={() => setSelectedCourse(course)} className="cursor-pointer hover:underline">
                {course.courseCode} {course.assignedSchool ? `- ${assignedSchoolObj ? assignedSchoolObj.name : ""}` : ""}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditCourse(course)} className="px-2 py-1 bg-green-600 text-white rounded">
                  Edit
                </button>
                <button onClick={() => handleRemoveCourse(course.id)} className="px-2 py-1 bg-red-600 text-white rounded">
                  Remove
                </button>
              </div>
            </li>
          );
        })}
        {courses.length === 0 && (
          <li className="p-4 bg-white rounded shadow text-center">No courses available.</li>
        )}
      </ul>
    </div>
  );

  return selectedCourse ? renderCourseDetails() : renderCourseList();
}