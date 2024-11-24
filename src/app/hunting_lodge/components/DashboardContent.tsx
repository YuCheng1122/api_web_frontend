'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { DashboardService, CriticalData, ChartData } from '@/features/dashboard_v2/api/dashboardService';
import type { TimeRange } from '@/features/dashboard_v2';
import type { AgentOS, EventTable as EventTableType } from '@/features/dashboard_v2/types';
import TimeRangeSelector from './TimeRangeSelector';
import Loading from './Loading';

// 動態導入組件
const AgentSummaryChart = lazy(() => import('./AgentSummaryChart'));
const AgentOSChart = lazy(() => import('./AgentOSChart'));
const AlertsChart = lazy(() => import('./AlertsChart'));
const SecurityEventsCard = lazy(() => import('./SecurityEventsCard'));
const TtpLineChart = lazy(() => import('./TtpLineChart'));
const MaliciousFileChart = lazy(() => import('./MaliciousFileChart'));
const AuthenticationChart = lazy(() => import('./AuthenticationChart'));
const MitreHeatmapChart = lazy(() => import('./MitreHeatmapChart'));
const EventStream = lazy(() => import('./EventStream'));

// 實現數據緩存
const CACHE_TIME = 5 * 60 * 1000; // 5分鐘緩存
const cache = new Map<string, { data: any; timestamp: number }>();

function getCachedData(key: string) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
        return cached.data;
    }
    cache.delete(key); // 自動刪除過期數據
    return null;
}

function setCachedData(key: string, data: any) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

// 清理過期緩存
function cleanupCache() {
    const now = Date.now();
    const keys = Array.from(cache.keys());
    keys.forEach(key => {
        const cached = cache.get(key);
        if (cached && now - cached.timestamp > CACHE_TIME) {
            cache.delete(key);
        }
    });
}

export default function DashboardContent() {
    const [criticalData, setCriticalData] = useState<CriticalData | null>(null);
    const [osData, setOSData] = useState<AgentOS | null>(null);
    const [eventData, setEventData] = useState<EventTableType | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 預加載其他組件
    useEffect(() => {
        const preloadComponents = async () => {
            const components = [
                './AgentSummaryChart',
                './AgentOSChart',
                './AlertsChart',
                './SecurityEventsCard',
                './TtpLineChart',
                './MaliciousFileChart',
                './AuthenticationChart',
                './MitreHeatmapChart',
                './EventStream'
            ];

            await Promise.all(
                components.map(component =>
                    import(component).catch(err =>
                        console.warn(`Failed to preload component: ${component}`, err)
                    )
                )
            );
        };

        preloadComponents();
    }, []);

    const fetchData = async (timeRange: TimeRange) => {
        setError(null);
        setIsLoading(true);

        const cacheKey = JSON.stringify(timeRange);
        const cachedResult = getCachedData(cacheKey);

        if (cachedResult) {
            setCriticalData(cachedResult.critical);
            setOSData(cachedResult.os);
            setEventData(cachedResult.events);
            setChartData(cachedResult.charts);
            setIsLoading(false);
            return;
        }

        try {
            // 使用 Promise.all 並行獲取所有數據
            const [
                critical,
                os,
                events,
                charts
            ] = await Promise.all([
                DashboardService.fetchCriticalData(timeRange),
                DashboardService.fetchOSData(timeRange),
                DashboardService.fetchEventTableData(timeRange),
                DashboardService.fetchChartData(timeRange)
            ]);

            // 緩存數據
            const result = { critical, os, events, charts };
            setCachedData(cacheKey, result);

            setCriticalData(critical);
            setOSData(os);
            setEventData(events);
            setChartData(charts);
        } catch (err: any) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data. Please try again later.');
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

        // 定期清理過期緩存
        const cleanup = setInterval(cleanupCache, CACHE_TIME / 2);
        return () => clearInterval(cleanup);
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

    if (isLoading || !criticalData || !osData || !eventData || !chartData) {
        return <Loading />;
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
            <TimeRangeSelector onChange={handleTimeRangeChange} />

            {/* 使用 Suspense 和動態導入的組件 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <AgentSummaryChart data={criticalData.agentSummary} />
                    </div>
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <AlertsChart data={criticalData.alerts} />
                    </div>
                </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <AgentOSChart data={osData} />
                    </div>
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <SecurityEventsCard data={eventData} />
                    </div>
                </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <MaliciousFileChart data={chartData.maliciousFile} />
                    </div>
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                        <AuthenticationChart data={chartData.authentication} />
                    </div>
                </Suspense>
            </div>

            <Suspense fallback={<Loading />}>
                <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <TtpLineChart data={chartData.ttpLinechart} />
                </div>
            </Suspense>

            {/* Add MITRE ATT&CK Matrix */}
            <Suspense fallback={<Loading />}>
                <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <MitreHeatmapChart data={eventData} />
                </div>
            </Suspense>

            {/* Add Event Stream */}
            <Suspense fallback={<Loading />}>
                <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                    <EventStream data={eventData.content.event_table} maxEvents={15} />
                </div>
            </Suspense>
        </div>
    );
}
