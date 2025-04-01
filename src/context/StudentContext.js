"use client";
import { createContext, useState, useContext } from "react";
import initialStudents from "../data/students.json";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  const [schoolStudents, setSchoolStudents] = useState(initialStudents);
  return (
    <StudentContext.Provider value={{ schoolStudents, setSchoolStudents }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  return useContext(StudentContext);
}
