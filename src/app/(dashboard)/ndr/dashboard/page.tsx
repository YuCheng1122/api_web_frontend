'use client'

import React from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';
import NDRDashboard from '@/app/(dashboard)/ndr/components/NDRDashboard';
import { useRouter } from 'next/navigation';

const NDRDashboardPage = () => {
    const { isAuthenticated } = useNDR();
    const router = useRouter();

    // If not authenticated, redirect to login page
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/ndr');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100">
            <div className="flex-1 p-4 bg-gray-50">
                <NDRDashboard />
            </div>
        </div>
    );
};

export default NDRDashboardPage;
