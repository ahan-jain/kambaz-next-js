"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link href="signin" className="list-group-item active border-0">
        Signin
      </Link>
      <Link href="signup" className="list-group-item text-danger border-0">
        Signup
      </Link>
      <Link href="profile" className="list-group-item text-danger border-0">
        Profile
      </Link>
      {currentUser && currentUser.role === "ADMIN" && (
        <Link href="users" className="list-group-item text-danger border-0">
          Users
        </Link>
      )}
    </div>
  );
}