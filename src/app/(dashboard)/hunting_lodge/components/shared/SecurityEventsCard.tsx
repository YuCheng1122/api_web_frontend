'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, AlertTriangle, Shield, Clock, Network, Crosshair } from 'lucide-react';
import { useAuthContext } from '../../../../../core/contexts/AuthContext';
import type { EventTable } from '../../../../../features/dashboard_v2/types';

interface Props {
    data: EventTable;
}

interface Event {
    rule_level: number;
}

const SecurityEventsCard: FC<Props> = ({ data }) => {
    const router = useRouter();
    const { isadmin } = useAuthContext();
    const events = data.content.event_table as Event[];
    const totalEvents = events.length;

    // Calculate severity counts
    const criticalEvents = events.filter((e: Event) => e.rule_level >= 10).length;
    const highEvents = events.filter((e: Event) => e.rule_level >= 7 && e.rule_level < 10).length;
    const mediumEvents = events.filter((e: Event) => e.rule_level >= 4 && e.rule_level < 7).length;
    const lowEvents = events.filter((e: Event) => e.rule_level < 4).length;

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

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">安全事件</h2>

            {/* 主要統計區塊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                {/* 總事件數 */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
                    <Activity className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{totalEvents}</div>
                    <div className="text-sm sm:text-base text-blue-100">安全事件總數</div>
                    <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-100">
                        最後更新：{new Date().toLocaleTimeString()}
                    </div>
                </div>

                {/* 嚴重程度統計 */}
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-red-50 rounded-lg p-2 sm:p-4">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mb-1 sm:mb-2" />
                        <div className="text-lg sm:text-2xl font-bold text-red-600">{criticalEvents}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                            {window.innerWidth >= 640 ? '嚴重事件' : 'Critical'}
                        </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 sm:p-4">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-1 sm:mb-2" />
                        <div className="text-lg sm:text-2xl font-bold text-orange-600">{highEvents}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                            {window.innerWidth >= 640 ? '高風險事件' : 'High'}
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2 sm:p-4 block sm:hidden">
                        <Shield className="w-5 h-5 text-yellow-600 mb-1" />
                        <div className="text-lg font-bold text-yellow-600">{mediumEvents}</div>
                        <div className="text-xs text-gray-600">Medium</div>
                    </div>
                </div>
            </div>

            {/* 嚴重程度分佈 - 僅在桌面版顯示 */}
            <div className="hidden sm:block bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">嚴重程度分佈</h3>
                <div className="space-y-3">
                    {[
                        { label: '嚴重', count: criticalEvents, color: '#DC2626' },
                        { label: '高風險', count: highEvents, color: '#F97316' },
                        { label: '中風險', count: mediumEvents, color: '#FBBF24' },
                        { label: '低風險', count: lowEvents, color: '#22C55E' }
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

            {/* 快速操作按鈕 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <button
                    onClick={handleEventsClick}
                    className="flex items-center justify-center gap-2 p-2 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-700">
                        {window.innerWidth >= 640 ? '查看事件' : 'View Events'}
                    </span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="flex items-center justify-center gap-2 p-2 sm:p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                            <Network className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            <span className="text-xs sm:text-sm font-medium text-emerald-700">
                                {window.innerWidth >= 640 ? '查看網路' : 'View Network'}
                            </span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="flex items-center justify-center gap-2 p-2 sm:p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                        >
                            <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                            <span className="text-xs sm:text-sm font-medium text-violet-700">
                                {window.innerWidth >= 640 ? '威脅獵捕' : 'Threat Hunting'}
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SecurityEventsCard;
