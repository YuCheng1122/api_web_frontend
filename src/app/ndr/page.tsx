'use client'

import React from 'react';
import NDRDashboard from '@/app/ndr/components/NDRDashboard';

const NDRPage = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100">
            <div className="flex-1 p-4 bg-gray-50">
                <NDRDashboard />
            </div>
        </div>
    );
};

export default NDRPage;
