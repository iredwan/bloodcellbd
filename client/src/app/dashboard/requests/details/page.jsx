'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation';
import {
  useGetRequestByIdQuery,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useProcessRequestMutation,
  useGetProcessingRequestsQuery,
  useGetUserDonateHistoryQuery,
} from "@/features/requests/requestApiSlice";

function requestDetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useGetRequestByIdQuery(id);
  

  return (
    <div className= "container mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
      {/* Request person details */}
      <ProfileCard/>
    </div>
  )
}

export default requestDetailsPage;