'use client';

import { FC, useEffect } from 'react';
import { useICS } from '../contexts/ICSContext';
import { useAuthContext } from '../../../../core/contexts/AuthContext';
import { fetchModbusEvents } from '../../../../features/ics/services/modbusApi';
import { Activity, AlertTriangle, Clock } from 'lucide-react';
import LoadingSpinner from '../../security-overview/components/Loading';

const ICSOverview: FC = () => {
    const {
        events,
        loading,
        error,
        eventRate,
        activeAlerts,
        lastUpdate,
        setEvents,
        setLoading,
        setError,
        setEventRate,
        setActiveAlerts,
        setLastUpdate,
    } = useICS();

    const { isLogin } = useAuthContext();

    useEffect(() => {
        const loadEvents = async () => {
            if (!isLogin) {
                setError('請先登入以查看事件');
                setLoading(false);
                return;
            }

            try {
                const response = await fetchModbusEvents();
                if (response.success) {
                    setEvents(response.content);
                    if (response.content.length > 0) {
                        const lastEvent = response.content[0];
                        const alertCount = response.content.filter(event => event.alert === 'true').length;
                        setLastUpdate(new Date(lastEvent.timestamp).toLocaleTimeString());
                        setActiveAlerts(alertCount);
                        setEventRate(Math.round(response.content.length / 5));
                    }
                } else {
                    throw new Error('可能未開通服務、或者是裝置未連接，請聯繫系統管理員');
                }
            } catch (err) {
                setError('可能未開通服務、或者是裝置未連接，請聯繫系統管理員');
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
        const interval = setInterval(loadEvents, 30000);

        return () => clearInterval(interval);
    }, [isLogin]);

    if (!isLogin) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">工業控制系統 (ICS)</h2>
                <div className="text-muted-foreground">
                    請先登入以查看相關資訊
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">工業控制系統 (ICS)</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    // 獲取最近的警報事件
    const recentAlerts = events
        .filter(event => event.alert === 'true')
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    工業控制系統 (ICS)
                </h2>

                {/* 狀態概覽 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">事件速率</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {eventRate}
                                    <span className="text-sm text-gray-500 ml-1">事件/分鐘</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">活動警報</p>
                                <p className="text-2xl font-semibold text-gray-900">{activeAlerts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">最後更新</p>
                                <p className="text-2xl font-semibold text-gray-900">{lastUpdate || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 最近警報 */}
                {recentAlerts.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">最近警報</h3>
                        <div className="space-y-2">
                            {recentAlerts.map((alert) => (
                                <div
                                    key={alert.event_id}
                                    className="bg-red-50 border border-red-100 rounded-lg p-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-red-800">
                                                {alert.event_type}
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                裝置: {alert.device_id}
                                            </p>
                                            <p className="text-xs text-red-600 mt-1">
                                                功能碼: {alert.modbus_function}
                                            </p>
                                        </div>
                                        <span className="text-xs text-red-500">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ICSOverview;
