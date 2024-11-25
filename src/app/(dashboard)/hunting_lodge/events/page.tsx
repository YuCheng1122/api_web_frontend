'use client';

import { useEffect, useState } from 'react';
import { DashboardService } from '@/features/dashboard_v2/api/dashboardService';
import type { EventTable } from '@/features/dashboard_v2/types';
import EventTableComponent from '@/app/(dashboard)/hunting_lodge/components/EventTable';
import TimeRangeSelector from '@/app/(dashboard)/hunting_lodge/components/TimeRangeSelector';
import type { TimeRange } from '@/features/dashboard_v2';

export default function EventsPage() {
    const [eventData, setEventData] = useState<EventTable | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (timeRange: TimeRange) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await DashboardService.fetchEventTableData(timeRange);
            setEventData(data);
        } catch (err: any) {
            console.error('Failed to fetch event data:', err);
            setError(err.message || 'Failed to load event data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialTimeRange = {
            start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date().toISOString()
        };
        fetchData(initialTimeRange);
    }, []);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Security Events</h1>
                <TimeRangeSelector onChange={fetchData} />
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : eventData && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <EventTableComponent data={eventData} />
                </div>
            )}
        </div>
    );
}
