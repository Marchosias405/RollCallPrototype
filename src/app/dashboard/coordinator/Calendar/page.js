"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../utils/supabase/client";

// mapping days
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
  if (!timeStr || typeof timeStr !== "string") {
    console.error("Invalid timeStr:", timeStr);
    return null;
  }

  let hours, minutes;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    // 12-hour format (e.g., "02:30 PM")
    const [time, modifier] = timeStr.split(" ");
    [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  } else {
    // 24-hour format (e.g., "13:30")
    [hours, minutes] = timeStr.split(":").map(Number);
  }

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

// helper to convert full day names to their abbreviated form
function convertDay(dayFull) {
  const mapping = {
    "Monday": "Mon",
    "Tuesday": "Tue",
    "Wednesday": "Wed",
    "Thursday": "Thu",
    "Friday": "Fri",
    "Saturday": "Sat",
    "Sunday": "Sun"
  };
  return mapping[dayFull] || dayFull;
}

export default function CoordinatorCalendarPage() {
  const [schoolData, setSchoolData] = useState([]);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { data: schoolData },
      ] = await Promise.all([
        supabase.from("School").select("*"),
      ]);
      console.log("Fetched school data:", schoolData);

      const mappedEvents = schoolData.map((school) => {
        const dayAbbr = convertDay(school.day);
        const timeStr = school.time;
        const dtstart = getNextOccurrence(dayAbbr, timeStr);

        return {
          id: school.id.toString(),
          title: school.name,
          rrule: {
            freq: "weekly",
            dtstart,
          },
          duration: "01:30",
        };
      });

      setEvents(mappedEvents);
    };

    fetchAll();
  }, []);

  const handleEventClick = (clickInfo) => {
    router.push(`/dashboard/coordinator/Schools?school=${encodeURIComponent(clickInfo.event.title)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col items-center overflow-auto">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
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
      <style jsx global>{`
        .fc-event:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
