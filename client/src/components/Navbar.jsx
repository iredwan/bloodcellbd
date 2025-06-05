"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";
import Toast from "@/utils/toast";
import { useGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import { useLogoutUserMutation } from "@/features/users/userApiSlice";
import {
  setUserInfo,
  clearUserInfo,
  selectUserInfo,
  selectIsAuthenticated,
} from "@/features/userInfo/userInfoSlice";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const currentPath = usePathname();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const user = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: userData,
    isLoading: userInfoLoading,
    error: userInfoError,
    isError: isUserInfoError,
  } = useGetUserInfoQuery(undefined, {
    skip: false,
    refetchOnWindowFocus: false,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (userData?.status && userData?.user) {
      dispatch(setUserInfo(userData.user));
    } else if (userData?.status === false) {
      dispatch(clearUserInfo());
    }
    if (userInfoError && userInfoError.status !== 401) {
      toast.error("Failed to load user info.");
    }
  }, [userData, userInfoError, dispatch]);

  const [logoutUser] = useLogoutUserMutation();

  const logOutFunction = async () => {
    try {
      const result = await logoutUser().unwrap();
      dispatch(clearUserInfo());
      toast.success(result?.message || "Logout successful");
      window.location.href = "/";
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const userRole = user?.role;
  const roleRoutes = {
    Admin: "/dashboard/admin",
    user: "/dashboard/user",
    Member: "/dashboard/member",
    Moderator: "/dashboard/moderator",
    Monitor: "/dashboard/monitor",
    Technician: "/dashboard/monitor",
    "Upazila Coordinator": "/dashboard/upazila-coordinator",
    "Upazila Co-coordinator": "/dashboard/upazila-coordinator",
    "Upazila IT & Media Coordinator": "/dashboard/upazila-coordinator",
    "Upazila Logistics Coordinator": "/dashboard/upazila-coordinator",
    "District Coordinator": "/dashboard/district-coordinator",
    "District Co-coordinator": "/dashboard/district-coordinator",
    "District IT & Media Coordinator": "/dashboard/district-coordinator",
    "District Logistics Coordinator": "/dashboard/district-coordinator",
    "Divisional Coordinator": "/dashboard/divisional-coordinator",
    "Divisional Co-coordinator": "/dashboard/divisional-coordinator",
    "Head of IT & Media": "/dashboard/divisional-coordinator",
    "Head of Logistics": "/dashboard/divisional-coordinator",
  };
  const dashboardPath = roleRoutes[userRole];

  return (
    <nav
      className="NaveBG shadow-md sticky top-0 z-50"
      style={{ backgroundColor: "#8a0303", color: "white" }}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-2xl font-bold text-white">BloodCellBD</span>
          </Link>

          <div className="hidden md:flex items-center text-center">
            <NavLink href="/" current={currentPath}>Home</NavLink>
            {!isAuthenticated && (
              <NavLink href="/register" current={currentPath}>Become a Donor</NavLink>
            )}
            <NavLink href="/ambassador-members" current={currentPath}>Ambassador Member</NavLink>
            <NavLink href="/events" current={currentPath}>Events</NavLink>
            <NavLink href="/sponsors" current={currentPath}>Sponsors</NavLink>
            <NavLink href="/about" current={currentPath}>About</NavLink>
            <NavLink href="/contact" current={currentPath}>Contact</NavLink>
            {dashboardPath && (
              <NavLink href={dashboardPath} current={currentPath}>
                <div className="flex items-center">
                  <FiSettings className="mr-1" /> Dashboard
                </div>
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex">
            {isAuthenticated ? (
              <button
                onClick={logOutFunction}
                className="bg-white text-[#8a0303] px-2 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1 hover:bg-gray-100"
              >
                <FiLogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white text-[#8a0303] px-2 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1 hover:bg-gray-100"
              >
                <FiUser className="h-4 w-4" /> Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <button
                onClick={logOutFunction}
                className="bg-white text-[#8a0303] px-2 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1 hover:bg-gray-100"
              >
                <FiLogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white text-[#8a0303] px-2 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1 hover:bg-gray-100"
              >
                <FiUser className="h-4 w-4" /> Login
              </Link>
            )}
            {isMenuOpen === false ? (
              <div
                onClick={() => setIsMenuOpen(true)}
                className="">
                  <FaBars className="h-6 w-6 text-white cursor-pointer"/>
                </div>
            ):(
              <div
                onClick={() => setIsMenuOpen(false)}
                className="">
                  <FaTimes className="h-6 w-6 text-white cursor-pointer"/>
                </div>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
        )}

        <div
          ref={menuRef}
          className={`absolute top-16 left-0 right-0 z-40 bg-white shadow-md transition-all duration-300 md:hidden ${
            isMenuOpen ? "max-h-[500px] py-3" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="px-4 space-y-2 text-center">
            <MobileNavLink href="/" current={currentPath} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            {!isAuthenticated && (
              <MobileNavLink href="/register" current={currentPath} onClick={() => setIsMenuOpen(false)}>Become a Donor</MobileNavLink>
            )}
            <MobileNavLink href="/ambassador-members" current={currentPath} onClick={() => setIsMenuOpen(false)}>Ambassador Member</MobileNavLink>
            <MobileNavLink href="/events" current={currentPath} onClick={() => setIsMenuOpen(false)}>Events</MobileNavLink>
            <MobileNavLink href="/sponsors" current={currentPath} onClick={() => setIsMenuOpen(false)}>Sponsors</MobileNavLink>
            <MobileNavLink href="/about" current={currentPath} onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/contact" current={currentPath} onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
            {dashboardPath && (
              <MobileNavLink href={dashboardPath} current={currentPath} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center justify-center">
                  <FiSettings className="mr-1" /> Dashboard
                </div>
              </MobileNavLink>
            )}
          </div>
        </div>
      </div>
      <Toast />
    </nav>
  );
};

const NavLink = ({ href, current, children }) => {
  const isActive = href === current;
  return (
    <Link
      href={href}
      className={`px-2 py-1 transition-all rounded-md ${
        isActive
          ? "text-white text-sm font-semibold border-b-2 border-white"
          : "text-gray-100 hover:text-white text-sm hover:font-semibold hover:border-b-2 hover:border-white"
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, current, onClick, children }) => {
  const isActive = href === current;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 rounded-md text-center transition-all duration-200 ${
        isActive
          ? "bg-[#8a0303] text-white font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#8a0303] font-medium"
      } text-sm`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
