"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { supabase } from "../../../../utils/supabase/client";

function convertTimeToMinutes(timeStr) {
  timeStr = timeStr.replace(/\s/g, "");
  const match = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/);
  if (!match) return 0;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

const dayMap = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// compute the next occurrence of a given day and time 
function getNextOccurrence(dayAbbr, timeStr) {
  const regex = /(\d{1,2}:\d{2})(?:\s)?(AM|PM)/i;
  const match = timeStr.match(regex);
  if (!match) {
    console.error("Invalid timeStr:", timeStr);
    return null;
  }
  const timePart = match[1];
  const modifier = match[2].toUpperCase();
  let [hours, minutes] = timePart.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const targetDay = dayMap[dayAbbr];
  let daysToAdd = targetDay - now.getDay();
  if (daysToAdd < 0) daysToAdd += 7;

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(hours, minutes, 0, 0);

  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 7);
  }
  return targetDate.toISOString();
}

function convertDay(dayFull) {
  const mapping = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return mapping[dayFull] || dayFull;
}

export default function InstructorCalendarPage() {
  const router = useRouter();
  const currentInstructorId = "inst1";
  const defaultTime = "09:00 AM";

  // fetch from supabase
  const [data, setData] = useState([]); // not used
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

  // filter and sort courses
  const filteredCourses = useMemo(() => {
    const inst1Courses = courses.filter(course =>
      course.instructor_ids.includes(currentInstructorId)
    );

    const dayOrder = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    return inst1Courses.sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      } else {
        const minutesA = convertTimeToMinutes(a.time || defaultTime);
        const minutesB = convertTimeToMinutes(b.time || defaultTime);
        return minutesA - minutesB;
      }
    });
  }, [courses, currentInstructorId]);

  // map to fullcalendar
  const events = useMemo(() => {
    return filteredCourses.map(course => {
      const dayAbbr = convertDay(course.day);
      const timeStr = course.time || defaultTime;
      const dtstart = getNextOccurrence(dayAbbr, timeStr);
      return {
        id: course.id.toString(),
        title: course.name,
        rrule: {
          freq: "weekly",
          dtstart,
        },
        duration: "01:00",
      };
    });
  }, [filteredCourses]);

  const handleEventClick = (clickInfo) => {
    alert(`Course clicked: ${clickInfo.event.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Calendar
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              rrulePlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
