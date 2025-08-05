'use client';

import PrivateRoute from '@/components/PrivateRoute';
import Sidebar from '@/components/dashboard-components/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';

export default function DistrictCoordinatorsLayout({ children }) {
  return (
    <PrivateRoute
      allowedRoles={[
        'Member',
        'Moderator',
        'Technician',
        'Monitor',
        'Upazila Coordinator',
        'Upazila Co-coordinator',
        'Upazila IT & Media Coordinator',
        'District Coordinator',
        'District Co-coordinator',
        'District IT & Media Coordinator',
        'District Logistics Coordinator',
        'Head of IT & Media',
        'Admin'

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
