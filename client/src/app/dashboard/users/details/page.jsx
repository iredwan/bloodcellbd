'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import RUDProfilePage from '@/components/dashboard-components/RUDProfilePage';

const page = () => {
    return (
        <div>
            <RUDProfilePage/>
        </div>
    );
};

export default page;