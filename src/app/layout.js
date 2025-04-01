import "./globals.css";
import { CourseProvider } from "../context/CourseContext";
import { StudentProvider } from "../context/StudentContext";

export const metadata = {
  title: "RollCall",
  description: "Attendance Management Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CourseProvider>
          <StudentProvider>
            {children}
          </StudentProvider>
        </CourseProvider>
      </body>
    </html>
  );
}
