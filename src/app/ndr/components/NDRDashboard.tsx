'use client'

import React from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';

const NDRDashboard = () => {
    const { data } = useNDR();

    return (
        <div className="w-full h-full">
            {/* NDR Dashboard content will be implemented here */}
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">NDR Dashboard</h1>
                {/* Add NDR specific components and visualizations here */}
            </div>
        </div>
    );
};

export default NDRDashboard;
