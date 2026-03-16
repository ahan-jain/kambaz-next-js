"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["profile"] : ["signin", "signup"];
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
    </div>
  );
}