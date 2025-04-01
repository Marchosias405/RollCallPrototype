"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoordinatorDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/coordinator/Home"); 
  }, [router]);

  return null; 
}