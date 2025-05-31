'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Profile from '@/components/dashboard-components/RUDProfilePage';

const page = () => {
    return (
        <div>
            <Profile/>
        </div>
    );
};

export default page;