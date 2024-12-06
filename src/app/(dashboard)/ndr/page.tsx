'use client';

import React from 'react';
import NDRDashboard from './components/NDRDashboard';
import NDRLoginForm from './components/NDRLoginForm';
import { useNDR } from '../../../features/ndr/hooks/useNDR';
import { NDRProvider } from './contexts/NDRContext';
import LoadingSpinner from './components/LoadingSpinner';

const NDRPage = () => {
    const { isAuthenticated, isLoading } = useNDR();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-100">
            {isAuthenticated ? (
                <NDRProvider>
                    <NDRDashboard />
                </NDRProvider>
            ) : (
                <NDRLoginForm />
            )}
        </div>
    );
};

export default NDRPage;
