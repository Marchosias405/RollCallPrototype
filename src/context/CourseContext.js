"use client";

import { createContext, useState, useContext } from "react";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  return useContext(CourseContext);
}
