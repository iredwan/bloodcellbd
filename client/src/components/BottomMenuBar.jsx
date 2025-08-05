"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUserInfo, selectIsAuthenticated } from "@/features/userInfo/userInfoSlice";
import { RiTeamFill } from "react-icons/ri";
import { BiDonateBlood } from "react-icons/bi";
import { FaUser, FaHome } from "react-icons/fa";

const teamRoutes = [
  { roles: ["Admin", "Head of IT & Media", "Head of Logistics"], path: "/dashboard/board-team" },
  { roles: ["Divisional Coordinator", "Divisional Co-coordinator"], path: "/dashboard/divisional-team" },
  { roles: ["District Coordinator", "District Co-coordinator", "District IT & Media Coordinator", "District Logistics Coordinator"], path: "/dashboard/district-team" },
  { roles: ["Upazila Coordinator", "Upazila Co-coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator"], path: "/dashboard/upazila-team" },
  { roles: ["Monitor"], path: "/dashboard/monitor-team" },
  { roles: ["Moderator", "Technician", "Member", "user"], path: "/dashboard/moderator-team" },
];

function getTeamPath(role) {
  if (!role) return null;
  for (const { roles, path } of teamRoutes) {
    if (roles.includes(role)) return path;
  }
  return null;
}

const BottomMenuBar = () => {
  const pathname = usePathname();
  const user = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return null;

  const userRole = user?.role;
  const teamPath = getTeamPath(userRole);

  const menus = [
    {
      label: "Home",
      href: "/",
      icon: <FaHome className="text-xl" />,
      active: pathname === "/",
    },
    {
      label: "Requests",
      href: "/dashboard/requests",
      icon: <BiDonateBlood className="text-xl" />,
      active: pathname.startsWith("/dashboard/requests"),
    },
    ...(userRole !== "user" && teamPath
      ? [
          {
            label: "Team",
            href: teamPath,
            icon: <RiTeamFill className="text-xl" />,
            active: pathname.startsWith(teamPath),
            disabled: !teamPath,
          },
        ]
      : []),
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <FaUser className="text-xl" />,
      active: pathname.startsWith("/dashboard/profile"),
    },
  ];
  

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden NaveBg border-t border-gray-200 shadow-lg">
      <ul className="flex justify-around items-center h-14">
        {menus.map((menu) => (
          <li key={menu.label} className="flex-1">
            {menu.disabled ? (
              <span className="flex flex-col items-center justify-center text-gray-300 cursor-not-allowed py-2">
                {menu.icon}
                <span className="text-xs mt-1">{menu.label}</span>
              </span>
            ) : (
              <Link
                href={menu.href}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  menu.active
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-[#8a0303]"
                }`}
                prefetch={false}
              >
                {menu.icon}
                <span className="text-xs mt-1">{menu.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomMenuBar; 