'use client';

import PrivateRoute from '@/components/PrivateRoute';
import Sidebar from '@/components/dashboard-components/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';

export default function DistrictCoordinatorsLayout({ children }) {
  return (
    <PrivateRoute
      allowedRoles={[
        'Admin',
        'Divisional Coordinator',
        'Divisional Co-coordinator',
      ]}
      requireAuth={true}
    >
      <SidebarProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </PrivateRoute>
  );
}
