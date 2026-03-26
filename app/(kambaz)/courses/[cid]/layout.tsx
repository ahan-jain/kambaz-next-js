"use client";
import { ReactNode, useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../database";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { redirect, useParams } from "next/navigation";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);
  const [showSidebar, setShowSidebar] = useState(true);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  if (!currentUser) {
  redirect("/account/signin");
}

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && (
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
