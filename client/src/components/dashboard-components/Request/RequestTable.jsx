import React from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import { BiSolidDonateBlood } from 'react-icons/bi';
import deleteConfirm from '@/utils/deleteConfirm';

const RequestTable = ({ 
  requests = [],
  isLoading,
  onEdit,
  onDelete,
  onProcess,
  onRowClick,
  totalPages,
  currentPage,
  onPageChange,
  userRole,
  deleteButtonForUser,
  fulfilled
}) => {

  const showActions =
  typeof onProcess === "function" ||
  typeof onEdit === "function" ||
  typeof onDelete === "function" 


  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmed = await deleteConfirm({
      title: 'Delete Request?',
      text: 'Are you sure you want to delete this blood request? This action cannot be undone!',
      confirmButtonText: 'Yes, delete request',
    });
    
    if (confirmed) {
      onDelete(id);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  if (requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400">
        No Blood Requests Found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {fulfilled ?(
                    'Donate Time'
                  ):(
                    'Crete Time'
                  )  }
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hospital Name
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Blood
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                {(showActions) && (
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((request) => (
                <tr key={request._id} 
                    onClick={() => onRowClick(request._id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.requestId}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {request.hospitalName}
                    </div>
                    <div className="md:hidden text-xs mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'fulfilled' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : request.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <div className='pt-2'>
                    {fulfilled ?(
                      <>
                      <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.updatedAt).toLocaleDateString('en-GB')}
                      </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(request.updatedAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      </div>
                      </>
                    ):(
                      <>
                      <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(request.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      </div>
                      </>
                    )}
                    </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <div className=''>
                    {fulfilled ?(
                      <>
                      <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.updatedAt).toLocaleDateString('en-GB')}
                      </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(request.updatedAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      </div>
                      </>
                    ):(
                      <>
                      <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(request.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      </div>
                      </>
                    )
                    }
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 ">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.hospitalName}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary font-semibold rounded-full">
                      {request.bloodGroup}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'fulfilled' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : request.status === 'pending'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : request.status === 'cancelled'
                        ? 'bg-primary text-red-100'
                        : request.status === 'rejected'
                        ? 'bg-primary text-red-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  {(showActions) && (
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      {typeof onEdit === "function" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(request);
                          }}
                          className="text-green-500 hover:text-green-700 transition-colors p-2 sm:p-1"
                          title="Edit Request"
                        >
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                            />
                          </svg>
                        </button>
                      )}
                      {typeof onDelete === "function" && (userRole === 'Admin' || userRole === 'Head of IT & Media' || deleteButtonForUser)  && (
                        <button
                            onClick={(e) => handleDelete(e, request._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 sm:p-1"
                            title="Delete Request"
                        >
                            <FaTrash className="text-base sm:text-base" />
                        </button>
                      )}

                    </div>
                  </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              pageCount={totalPages}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTable;