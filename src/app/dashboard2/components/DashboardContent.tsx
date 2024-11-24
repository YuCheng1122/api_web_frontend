'use client';

import { useEffect, useState } from 'react';
import { DashboardService, CriticalData, ChartData } from '@/features/dashboard2.0/api/dashboardService';
import type { TimeRange } from '@/features/dashboard2.0/types';
import type { AgentOS, EventTable as EventTableType } from '@/features/dashboard2.0/types/generated';
import AgentSummaryChart from './AgentSummaryChart';
import AgentOSChart from './AgentOSChart';
import AlertsChart from './AlertsChart';
import SecurityEventsCard from './SecurityEventsCard';
import TtpLineChart from './TtpLineChart';
import MaliciousFileChart from './MaliciousFileChart';
import AuthenticationChart from './AuthenticationChart';
import TimeRangeSelector from './TimeRangeSelector';

export default function DashboardContent() {
    const [criticalData, setCriticalData] = useState<CriticalData | null>(null);
    const [osData, setOSData] = useState<AgentOS | null>(null);
    const [eventData, setEventData] = useState<EventTableType | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingCritical, setIsLoadingCritical] = useState(true);
    const [isLoadingOS, setIsLoadingOS] = useState(true);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isLoadingCharts, setIsLoadingCharts] = useState(true);

    const fetchData = async (timeRange: TimeRange) => {
        setError(null);

        // Reset loading states
        setIsLoadingCritical(true);
        setIsLoadingOS(true);
        setIsLoadingEvents(true);
        setIsLoadingCharts(true);

        try {
            // Fetch critical data first (summary and alerts)
            const critical = await DashboardService.fetchCriticalData(timeRange);
            setCriticalData(critical);
            setIsLoadingCritical(false);

            // Fetch OS data
            DashboardService.fetchOSData(timeRange)
                .then(data => {
                    setOSData(data);
                    setIsLoadingOS(false);
                })
                .catch(console.error);

            // Fetch event data for summary
            DashboardService.fetchEventTableData(timeRange)
                .then(data => {
                    setEventData(data);
                    setIsLoadingEvents(false);
                })
                .catch(console.error);

            // Fetch chart data
            DashboardService.fetchChartData(timeRange)
                .then(data => {
                    setChartData(data);
                    setIsLoadingCharts(false);
                })
                .catch(console.error);

        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data. Please try again later.');
            setIsLoadingCritical(false);
            setIsLoadingOS(false);
            setIsLoadingEvents(false);
            setIsLoadingCharts(false);
        }
    };

    useEffect(() => {
        const initialTimeRange = {
            start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date().toISOString()
        };
        fetchData(initialTimeRange);
    }, []);

    const handleTimeRangeChange = (newTimeRange: TimeRange) => {
        fetchData(newTimeRange);
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    const LoadingCard = () => (
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
            <TimeRangeSelector onChange={handleTimeRangeChange} />

            {/* First Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingCritical ? (
                    <LoadingCard />
                ) : criticalData && (
                    <AgentSummaryChart data={criticalData.agentSummary} />
                )}

                {isLoadingCritical ? (
                    <LoadingCard />
                ) : criticalData && (
                    <AlertsChart data={criticalData.alerts} />
                )}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingOS ? (
                    <LoadingCard />
                ) : osData && (
                    <AgentOSChart data={osData} />
                )}

                {isLoadingEvents ? (
                    <LoadingCard />
                ) : eventData && (
                    <SecurityEventsCard data={eventData} />
                )}
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingCharts ? (
                    <LoadingCard />
                ) : chartData && (
                    <MaliciousFileChart data={chartData.maliciousFile} />
                )}

                {isLoadingCharts ? (
                    <LoadingCard />
                ) : chartData && (
                    <AuthenticationChart data={chartData.authentication} />
                )}
            </div>

            {/* Fourth Row - Full Width */}
            {isLoadingCharts ? (
                <LoadingCard />
            ) : chartData && (
                <TtpLineChart data={chartData.ttpLinechart} />
            )}
        </div>
    );
}
