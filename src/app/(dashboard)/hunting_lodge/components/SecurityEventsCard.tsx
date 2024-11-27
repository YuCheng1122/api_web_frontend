'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, AlertTriangle, Shield, Clock, Network, Crosshair } from 'lucide-react';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';
import type { EventTable } from '@/features/dashboard_v2/types';

interface Props {
    data: EventTable;
}

export default function SecurityEventsCard({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const { isadmin } = useAuthContext();
    const events = data.content.event_table;
    const totalEvents = events.length;

    // Calculate severity counts
    const criticalEvents = events.filter(e => e.rule_level >= 10).length;
    const highEvents = events.filter(e => e.rule_level >= 7 && e.rule_level < 10).length;
    const mediumEvents = events.filter(e => e.rule_level >= 4 && e.rule_level < 7).length;
    const lowEvents = events.filter(e => e.rule_level < 4).length;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleEventsClick = () => {
        router.push('/hunting_lodge/events');
    };

    const handleNetworkClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/network');
    };

    const handleThreatHuntingClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/threat-hunting');
    };

    // 移動端視圖
    const MobileView = () => (
        <>
            <div className="mb-3">
                <div className="text-xs text-gray-600">Total Events</div>
                <div className="text-2xl font-bold text-gray-900">{totalEvents}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-600">Critical</div>
                    <div className="text-lg font-bold text-red-600">
                        {criticalEvents}
                    </div>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                    <div className="text-xs text-gray-600">High</div>
                    <div className="text-lg font-bold text-orange-600">
                        {highEvents}
                    </div>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                    <div className="text-xs text-gray-600">Medium</div>
                    <div className="text-lg font-bold text-yellow-600">
                        {mediumEvents}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
                <button
                    onClick={handleEventsClick}
                    className="text-center text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    <span>View Events</span>
                    <span className="ml-1">→</span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="text-center text-xs text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span>View Network</span>
                            <span className="ml-1">→</span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="text-center text-xs text-violet-600 hover:text-violet-800 hover:bg-violet-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span>Threat Hunting</span>
                            <span className="ml-1">→</span>
                        </button>
                    </>
                )}
            </div>
        </>
    );

    // 桌面端視圖
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 主要統計 */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <Activity className="w-8 h-8 mb-4" />
                    <div className="text-3xl font-bold mb-2">{totalEvents}</div>
                    <div className="text-blue-100">Total Security Events</div>
                    <div className="mt-4 text-sm text-blue-100">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                        <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
                        <div className="text-sm text-gray-600">Critical Events</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <Shield className="w-6 h-6 text-orange-600 mb-2" />
                        <div className="text-2xl font-bold text-orange-600">{highEvents}</div>
                        <div className="text-sm text-gray-600">High Severity</div>
                    </div>
                </div>
            </div>

            {/* 嚴重程度分佈 */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Severity Distribution</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Critical', count: criticalEvents, color: '#DC2626' },
                        { label: 'High', count: highEvents, color: '#F97316' },
                        { label: 'Medium', count: mediumEvents, color: '#FBBF24' },
                        { label: 'Low', count: lowEvents, color: '#22C55E' }
                    ].map(item => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">{item.label}</span>
                                <span className="font-medium">{item.count}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        backgroundColor: item.color,
                                        width: `${(item.count / totalEvents * 100) || 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 快速操作 */}
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={handleEventsClick}
                    className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">View Events</span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="flex items-center justify-center gap-2 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
                        >
                            <Network className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">View Network</span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="flex items-center justify-center gap-2 p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors group"
                        >
                            <Crosshair className="w-5 h-5 text-violet-600" />
                            <span className="text-sm font-medium text-violet-700">Threat Hunting</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Security Events</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
