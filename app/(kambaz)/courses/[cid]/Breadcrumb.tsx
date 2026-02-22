"use client";
import React from "react";
import { usePathname } from "next/navigation";
export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();
  let path = pathname.split("/").pop();
  path = path?.charAt(0).toUpperCase() + path?.substring(1);
  return (
    <span>
      Course {course?.name} &gt; {path}
    </span>
  );
}
