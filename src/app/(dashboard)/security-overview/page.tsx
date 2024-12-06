'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { DashboardService, CriticalData } from '../../../features/dashboard_v2/api/dashboardService';
import type { TimeRange } from '../../../features/dashboard_v2';
import type { EventTable as EventTableType } from '../../../features/dashboard_v2/types';
import { DashboardProvider } from '../hunting_lodge/contexts/DashboardContext';
import { NDRProvider } from '../ndr/contexts/NDRContext';
import { useNDR } from '../../../features/ndr/hooks/useNDR';
import Loading from './components/Loading';

// 動態導入重構後的組件
const AgentSummaryChart = lazy(() => import('../hunting_lodge/components/shared/AgentSummaryChart'));
const AlertsChart = lazy(() => import('../hunting_lodge/components/shared/AlertsChart'));
const SecurityEventsCard = lazy(() => import('../hunting_lodge/components/shared/SecurityEventsCard'));
const MitreHeatmapChart = lazy(() => import('../hunting_lodge/components/shared/MitreHeatmapChart'));
const NDROverview = lazy(() => import('../ndr/components/NDROverview'));

interface DashboardState {
    agentOS: null;
    agentSummary: CriticalData['agentSummary'] | null;
    alerts: CriticalData['alerts'] | null;
    authentication: null;
    cveBarchart: null;
    eventTable: EventTableType | null;
    maliciousFile: null;
    tactics: null;
    ttpLinechart: null;
}

export default function SecurityOverviewPage() {
    const { isAuthenticated: isNDRAuthenticated } = useNDR();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardState>({
        agentOS: null,
        agentSummary: null,
        alerts: null,
        authentication: null,
        cveBarchart: null,
        eventTable: null,
        maliciousFile: null,
        tactics: null,
        ttpLinechart: null
    });

    const fetchData = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const timeRange = {
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                end_time: new Date().toISOString()
            };

            // 只獲取需要的數據
            const [critical, events] = await Promise.all([
                DashboardService.fetchCriticalData(timeRange),
                DashboardService.fetchEventTableData(timeRange),
            ]);

            // 確保 events 數據存在且格式正確
            const validEvents = events && events.content && Array.isArray(events.content.event_table)
                ? events
                : { success: true, content: { event_table: [] }, message: '' };

            setDashboardData({
                agentOS: null,
                agentSummary: critical.agentSummary,
                alerts: critical.alerts,
                authentication: null,
                cveBarchart: null,
                eventTable: validEvents,
                maliciousFile: null,
                tactics: null,
                ttpLinechart: null
            });
        } catch (err: any) {
            console.error('Failed to fetch security overview data:', err);
            setError(err.message || 'Failed to load security overview data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // 每5分鐘更新一次數據
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <DashboardProvider initialData={dashboardData}>
            <div className="container mx-auto p-4">
                <Suspense fallback={<Loading />}>
                    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-3 sm:py-6 space-y-3 sm:space-y-6">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-6">安全概覽</h1>

                        {/* EDR 部分 */}
                        <div className="space-y-6">
                            <h2 className="text-xl sm:text-2xl font-semibold">端點偵測與回應 (EDR)</h2>

                            {/* 主要指標 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                                <Suspense fallback={<Loading />}>
                                    <div className="transform transition-transform duration-200 hover:scale-[1.02] min-h-[300px] sm:min-h-[400px]">
                                        <SecurityEventsCard />
                                    </div>
                                </Suspense>
                                <Suspense fallback={<Loading />}>
                                    <div className="transform transition-transform duration-200 hover:scale-[1.02] min-h-[300px] sm:min-h-[400px]">
                                        <AgentSummaryChart />
                                    </div>
                                </Suspense>
                            </div>

                            {/* 警報和攻擊分析 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                                <Suspense fallback={<Loading />}>
                                    <div className="transform transition-transform duration-200 hover:scale-[1.02] min-h-[300px] sm:min-h-[400px]">
                                        <AlertsChart />
                                    </div>
                                </Suspense>
                                <Suspense fallback={<Loading />}>
                                    <div className="transform transition-transform duration-200 hover:scale-[1.02] min-h-[300px] sm:min-h-[400px]">
                                        <MitreHeatmapChart />
                                    </div>
                                </Suspense>
                            </div>
                        </div>

                        {/* NDR 部分 */}
                        <div className="space-y-6">
                            {isNDRAuthenticated ? (
                                <NDRProvider>
                                    <Suspense fallback={<Loading />}>
                                        <NDROverview />
                                    </Suspense>
                                </NDRProvider>
                            ) : (
                                <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">網路偵測與回應 (NDR)</h2>
                                    <p className="text-muted-foreground">請先登入 NDR 系統以查看相關資訊</p>
                                </div>
                            )}
                        </div>

                        {/* ICS 部分 - 待實現 */}
                        <div className="space-y-6">
                            <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2">工業控制系統 (ICS)</h2>
                                <p className="text-muted-foreground">即將推出</p>
                            </div>
                        </div>
                    </div>
                </Suspense>
            </div>
        </DashboardProvider>
    );
}
