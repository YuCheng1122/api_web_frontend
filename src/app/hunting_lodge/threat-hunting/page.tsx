'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '@/app/hunting_lodge/components/Loading';
import { DashboardService } from '@/features/dashboard_v2/api/dashboardService';
import type { EventTable } from '@/features/dashboard_v2/types';

export default function ThreatHuntingPage() {
    const router = useRouter();
    const [data, setData] = useState<EventTable | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const timeRange = {
                    start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    end_time: new Date().toISOString()
                };

                const eventData = await DashboardService.fetchEventTableData(timeRange);
                setData(eventData);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch threat data:', err);
                if (err.response?.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                setError(err.message || 'Failed to load threat data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Threat Hunting</h1>
                    <Link
                        href="/hunting_lodge"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (isLoading || !data) {
        return (
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Threat Hunting</h1>
                    <Link
                        href="/hunting_lodge"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
                <div className="flex items-center justify-center min-h-[600px]">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Threat Hunting</h1>
                <Link
                    href="/hunting_lodge"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                * This visualization shows the relationships between security events, MITRE ATT&CK tactics, and techniques.
                Use mouse wheel to zoom and drag to pan around the visualization.
            </div>
        </div>
    );
}
