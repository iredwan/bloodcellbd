'use client';

import Sidebar from '@/components/dashboard-components/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
} 