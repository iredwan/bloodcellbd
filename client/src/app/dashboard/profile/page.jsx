'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Profile from '@/components/dashboard-components/RUDProfilePage';
import { useGetUserByIdQuery } from '@/features/users/userApiSlice';

const page = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const {
        data: response,
        isLoading,
        isError,
        error,
      } = useGetUserByIdQuery(id, {
        skip: !id,
      });

    return (
        <div>
            <Profile user={response?.data} />
        </div>
    );
};

export default page;