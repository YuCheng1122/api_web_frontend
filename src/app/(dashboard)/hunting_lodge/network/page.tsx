'use client';

import { useEffect, useState } from 'react';
import { DashboardService } from '@/features/dashboard_v2/api/dashboardService';
import type { EventTable as EventTableType } from '@/features/dashboard_v2/types';
import NetworkTopologyChart from '@/app/(dashboard)/hunting_lodge/components/NetworkTopologyChart';
import Loading from '@/app/(dashboard)/hunting_lodge/components/Loading';
import Link from 'next/link';

export default function NetworkPage() {
    const [eventData, setEventData] = useState<EventTableType | null>(null);
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

                const data = await DashboardService.fetchEventTableData(timeRange);
                setEventData(data);
            } catch (err: any) {
                console.error('Failed to fetch network data:', err);
                setError(err.message || 'Failed to load network data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Network Topology</h1>
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

    if (isLoading || !eventData) {
        return (
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Network Topology</h1>
                    <Link
                        href="/hunting_lodge"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Network Topology</h1>
                <Link
                    href="/hunting_lodge"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="h-[800px]"> {/* Fixed height for better visualization */}
                    <NetworkTopologyChart data={eventData.content.event_table} />
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                * Nodes represent agents, lines represent potential attack paths.
                Drag nodes to explore relationships. Use mouse wheel to zoom.
            </div>
        </div>
    );
}
