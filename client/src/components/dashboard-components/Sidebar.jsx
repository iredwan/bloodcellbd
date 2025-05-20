'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { FiMenu, FiChevronLeft, FiChevronRight, FiSettings, FiX } from 'react-icons/fi';
import {
  MdDashboardCustomize,
  MdOutlineViewCarousel,
  MdRateReview,
  MdSettings,
} from 'react-icons/md';
import {
  FaHospital,
  FaUser,
  FaStar,
} from 'react-icons/fa';
import {
  RiTeamLine,
  RiTeamFill,
  RiUserStarLine,
} from 'react-icons/ri';
import { BiDonateBlood } from 'react-icons/bi';
import { BsCalendar2Event } from 'react-icons/bs';
import { selectUserInfo } from '@/features/userInfo/userInfoSlice';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobile, toggleSidebar } = useSidebar();
  const user = useSelector(selectUserInfo);
  const userRole = user?.role?.toLowerCase();

  // Handle menu item click
  const handleMenuItemClick = () => {
    toggleSidebar();
  };

  const sidebarItems = [
    {
      section: 'Core',
      items: [
        { label: 'Dashboard', href: `/dashboard/${userRole}`, icon: <MdDashboardCustomize />, roles: ['Admin'] },
        { label: 'Users', href: '/dashboard/admin/users', icon: <FaUser />, roles: ['Admin'] },
        { label: 'Requests', href: '/dashboard/admin/requests', icon: <BiDonateBlood />, roles: ['Admin'] },
        { label: 'WTD', href: '/dashboard/admin/wtd', icon: <BiDonateBlood />, roles: ['Admin'] },
        { label: 'Ambassadors', href: '/dashboard/admin/ambassadors', icon: <RiUserStarLine />, roles: ['Admin'] },
        { label: 'Sponsors', href: '/dashboard/admin/sponsors', icon: <FaStar />, roles: ['Admin'] },
        { label: 'Website Config', href: '/dashboard/admin/config', icon: <MdSettings />, roles: ['Admin'] },
        { label: 'Profile', href: '/dashboard/admin/profile', icon: <FaUser />, roles: ['Admin', 'Moderator', 'Monitor', 'User'] },
      ],
    },
    {
      section: 'Content',
      items: [
        { label: 'Carousel', href: '/dashboard/admin/carousel', icon: <MdOutlineViewCarousel />, roles: ['Admin'] },
        { label: 'Events', href: '/dashboard/admin/events', icon: <BsCalendar2Event />, roles: ['Admin'] },
      ],
    },
    {
      section: 'Teams',
      items: [
        { label: 'Board Team', href: '/dashboard/admin/board-team', icon: <RiTeamLine />, roles: ['Admin'] },
        { label: 'Divisional Team', href: '/dashboard/admin/divisional-team', icon: <RiTeamFill />, roles: ['Admin'] },
        { label: 'District Team', href: '/dashboard/admin/district-team', icon: <RiTeamFill />, roles: ['Admin'] },
        { label: 'Upazila Team', href: '/dashboard/admin/upazila-team', icon: <RiTeamFill />, roles: ['Admin'] },
        { label: 'Monitor Team', href: '/dashboard/admin/monitor-team', icon: <RiTeamFill />, roles: ['Admin'] },
        { label: 'Moderator Team', href: '/dashboard/admin/moderator-team', icon: <RiTeamFill />, roles: ['Admin'] },
      ],
    },
    {
      section:'Other',
      items:[
        { label: 'Hospitals', href: '/dashboard/admin/hospitals', icon: <FaHospital />, roles: ['Admin'] },
        { label: 'Reviews', href: '/dashboard/admin/reviews', icon: <MdRateReview />, roles: ['Admin'] },
      ]
    }
  ];
  
  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-40 p-2 bg-white rounded-full shadow-md hover:scale-105 transition-transform duration-200"
        >
          <FiMenu className="text-xl" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          id="sidebar-overlay" 
          className="fixed inset-0 z-35 bg-black opacity-50 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-[58] h-[calc(100vh-4rem)]
          bg-white dark:bg-gray-800 shadow-lg
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${isOpen ? 'w-64' : 'w-12'}
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col overflow-y-auto px-1 py-6">
          {/* Header + Toggle */}
          <div className={`flex items-center justify-between mb-3 ${isOpen ? 'px-2' : 'px-1'}`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center transition-all duration-300 ease-in-out">
                {isOpen ? (
                  <h1 className="text-2xl font-bold text-primary transition-all duration-300">
                    Dashboard
                  </h1>
                ) : (
                  <span 
                    className="text-xl text-primary cursor-pointer transition-all duration-300 hover:scale-110"
                    onClick={toggleSidebar}
                  >
                    <FiSettings className="transform hover:rotate-45 transition-all duration-300" />
                  </span>
                )}
              </div>
              {isMobile && isOpen && (
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
                >
                  <FiX className="mx-2 hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>
            {!isMobile && (
              <button 
                onClick={toggleSidebar} 
                className={`text-gray-500 dark:text-gray-300 hover:text-primary transition-all duration-200 ${isOpen ? 'p-1' : 'p-0'} rounded-full`}
              >
                {isOpen ? (
                  <FiChevronLeft className="text-primary transform transition-transform duration-300 hover:scale-110 animate-slide-left" size={20} />
                ) : (
                  <FiChevronRight className="text-primary transform transition-transform duration-300 hover:scale-110 animate-slide-right" size={20} />
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-6 flex-1 overflow-y-auto">
            {sidebarItems.map((section, idx) => {
              // Filter items based on user role first
              const filteredItems = section.items.filter(item => 
                item.roles.includes(user?.role)
              );

              // Only render section if it has items for this user's role
              if (filteredItems.length === 0) return null;

              return (
                <div
                  className='border-b border-gray-200 dark:border-gray-700 pb-2'
                  key={idx}
                >
                  {isOpen && (
                    <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 px-3 transition-opacity duration-200">
                      {section.section}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {filteredItems.map((item, i) => (
                      <li key={i}>
                        <Link
                          href={item.href}
                          onClick={handleMenuItemClick}
                          className={`
                            flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-3 py-2 rounded-lg
                            text-sm font-medium group
                            transition-all duration-200 ease-in-out
                            ${pathname === item.href
                              ? 'bg-primary text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          <span className={`
                            text-lg transition-transform duration-300 ease-in-out
                            ${!isOpen ? 'transform group-hover:scale-110' : 'group-hover:translate-x-1'}
                          `}>
                            {item.icon}
                          </span>
                          {isOpen && (
                            <span className="transition-opacity duration-200 group-hover:translate-x-1">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Spacer div to push content */}
      <div 
        className={`
          shrink-0 transition-all duration-300
          ${isMobile ? 'w-0' : isOpen ? 'w-64' : 'w-12'}
        `} 
      />
    </>
  );
}
