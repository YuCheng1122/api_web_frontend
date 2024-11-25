'use client'

import React from 'react';
import NDRDashboard from '@/app/(dashboard)/ndr/components/NDRDashboard';
import NDRLoginForm from '@/app/(dashboard)/ndr/components/NDRLoginForm';
import { useNDR } from '@/features/ndr/hooks/useNDR';

const NDRPage = () => {
    const { isAuthenticated, isLoading } = useNDR();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
                    <div className="mt-4 text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-100">
            {isAuthenticated ? <NDRDashboard /> : <NDRLoginForm />}
        </div>
    );
};

export default NDRPage;
