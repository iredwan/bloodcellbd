"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiUser,
  FiSettings,
  FiClipboard,
  FiUsers,
} from "react-icons/fi";
import {getCookie, setCookie, deleteCookie} from 'cookies-next';
import { logout } from "@/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const logOutFunction = async () => {
    try {
      const result = await logout();
      if (result) {
        deleteCookie("token");
        setIsAuthenticated(false);
        setUserRole(null);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const isAdmin = userRole === "Admin";
  const isUser = userRole === "user";
  const isTechnician = userRole === "Technician";
  const isMember = userRole === "Member";
  const isModerator = userRole === "Moderator";
  const isMonitor = userRole === "Monitor";
  const isUpazilaCoordinator = userRole === "Upazila Coordinator";
  const isUpazilaSubCoordinator = userRole === "Upazila Sub-Coordinator";
  const isUpazilaITMediaCoordinator = userRole === "Upazila IT & Media Coordinator";
  const isUpazilaLogisticsCoordinator = userRole === "Upazila Logistics Coordinator";
  const isDistrictCoordinator = userRole === "District Coordinator";
  const isDistrictSubCoordinator = userRole === "District Sub-Coordinator";
  const isDistrictITMediaCoordinator = userRole === "District IT & Media Coordinator";
  const isDistrictLogisticsCoordinator = userRole === "District Logistics Coordinator";
  const isDivisionalCoordinator = userRole === "Divisional Coordinator";
  const isDivisionalSubCoordinator = userRole === "Divisional Sub-Coordinator";
  const isHeadOfITMedia = userRole === "Head of IT & Media";
  const isHeadOfLogistics = userRole === "Head of Logistics";

  return (
    <nav className="NaveBG shadow-md sticky top-0 z-50" style={{ backgroundColor: '#8a0303', color: 'white' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" current={currentPath}>
              Home
            </NavLink>
            <NavLink href="/sponsors" current={currentPath}>
              Sponsors
            </NavLink>
            <NavLink href="/ambassador-members" current={currentPath}>
            Ambassador Member
            </NavLink>
            <NavLink href="/register" current={currentPath}>
              Become a Donor
            </NavLink>
            <NavLink href="/about" current={currentPath}>
              About
            </NavLink>
            <NavLink href="/contact" current={currentPath}>
              Contact
            </NavLink>

            {/* Admin Menu (Desktop) */}
            {isAdmin && (
              <div className="hidden md:flex">
                <NavLink
                  href="/dashboard"
                  current={currentPath}>
                  <div className="flex items-center transition-all rounded-md">
                    <FiSettings className="mr-1" />
                    Admin
                  </div>
                </NavLink>
              </div>
            )}
            
            {isUser && (
              <div className="hidden md:flex">
                <NavLink 
                href="/profile" 
                current={currentPath}>
                  <div className="flex items-center transition-all rounded-md">
                    <FiUser className="mr-1" />
                    Profile
                  </div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Login/Logout Button */}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <button
                onClick={logOutFunction}
                className="bg-white text-[#8a0303] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex justify-center items-center text-center leading-normal bg-white text-[#8a0303] px-3 py-1.5 rounded-full font-medium shadow-md gap-2 cursor-pointer hover:bg-gray-100"
              >
                <FiUser className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated ? (
              <button
                onClick={logOutFunction}
                className="flex justify-center items-center text-center leading-normal bg-white text-[#8a0303] px-3 py-1.5 rounded-md font-medium shadow-md gap-2 cursor-pointer hover:bg-gray-100"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex justify-center items-center text-center leading-normal bg-white text-[#8a0303] px-3 py-1.5 rounded-full font-medium shadow-md gap-2 cursor-pointer hover:bg-gray-100"
              >
                <FiUser className="h-4 w-4" />
                Login
              </Link>
            )}
            <svg
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-6 w-6 text-white cursor-pointer"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </div>
        </div>
        {/* Mobile Menu - Fixed Visibility & Transitions */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 space-y-2 bg-white shadow-md border-t">
            <MobileNavLink href="/" current={currentPath}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/sponsors" current={currentPath}>
              Sponsors
            </MobileNavLink>
            <MobileNavLink href="/ambassador-members" current={currentPath}>
              Ambassador Member
            </MobileNavLink>
            <MobileNavLink href="/register" current={currentPath}>
              Become a Donor
            </MobileNavLink>
            <MobileNavLink href="/about" current={currentPath}>
              About
            </MobileNavLink>
            <MobileNavLink href="/contact" current={currentPath}>
              Contact
            </MobileNavLink>

            {/* Admin Menu Items (Mobile) */}
            {isAdmin && (
              <>
                <MobileNavLink href="/dashboard" current={currentPath}>
                  <div className="flex items-center transition-all rounded-md justify-center">
                    <FiSettings className="mr-1" />
                    Dashboard
                  </div>
                </MobileNavLink>
              </>
            )}
            {isUser && (
              <>
                <MobileNavLink href="/user-dashboard" current={currentPath}>
                  <div className="flex items-center transition-all rounded-md justify-center">
                    <FiUser className="mr-1" />
                    Profile
                  </div>
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

//✅ NavLink for Desktop
const NavLink = ({ href, current, children }) => {
  const isActive = href === current;
  return (
    <Link
      href={href}
      className={`px-3 py-2 transition-all rounded-md ${
        isActive
          ? "text-white font-semibold border-b-2 border-white"
          : "text-gray-100 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

// ✅ NavLink for Mobile (Fixed Styles)
const MobileNavLink = ({ href, current, children }) => {
  const isActive = href === current;
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md text-center transition-all duration-200 ${
        isActive
          ? "bg-[#8a0303] text-white font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#8a0303]"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
