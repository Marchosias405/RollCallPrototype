"use client";

import { Suspense } from "react";
import SchoolsContent from "./SchoolsContent";

export default function CoordinatorSchoolsPage() {
  return (
    <Suspense fallback={<div>Loading Schools...</div>}>
      <SchoolsContent />
    </Suspense>
  );
}
