"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
  const router = useRouter();

  useEffect(() => {
    // redirect to home page
    router.replace("/dashboard/instructor/Home");
  }, [router]);

  return null;
}
