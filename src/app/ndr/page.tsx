'use client'

import React, { useEffect } from 'react';
import NDRDashboard from '@/app/ndr/components/NDRDashboard';
import NDRLoginForm from '@/app/ndr/components/NDRLoginForm';
import { useNDR } from '@/features/ndr/hooks/useNDR';

const NDRPage = () => {
    const { isAuthenticated, isLoading } = useNDR();

    // Force a re-render when authentication state changes
    useEffect(() => {
        console.log('Auth state changed:', { isAuthenticated, isLoading });
    }, [isAuthenticated, isLoading]);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100">
            <div className="flex-1 p-4 bg-gray-50">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-xl">Loading...</div>
                    </div>
                ) : isAuthenticated ? (
                    <NDRDashboard />
                ) : (
                    <NDRLoginForm />
                )}
            </div>
        </div>
    );
};

export default NDRPage;
