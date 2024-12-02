'use client';

import { FC } from 'react';
import { Activity, AlertTriangle, Shield, Clock, Network, Crosshair } from 'lucide-react';

interface DesktopViewProps {
    totalEvents: number;
    criticalEvents: number;
    highEvents: number;
    mediumEvents: number;
    lowEvents: number;
    handleEventsClick: () => void;
    handleNetworkClick: () => void;
    handleThreatHuntingClick: () => void;
    isadmin: boolean;
}

export const DesktopView: FC<DesktopViewProps> = ({
    totalEvents,
    criticalEvents,
    highEvents,
    mediumEvents,
    lowEvents,
    handleEventsClick,
    handleNetworkClick,
    handleThreatHuntingClick,
    isadmin,
}) => {
    return (
        <div className="space-y-6">
            {/* 主要統計 */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <Activity className="w-8 h-8 mb-4" />
                    <div className="text-3xl font-bold mb-2">{totalEvents}</div>
                    <div className="text-blue-100">安全事件總數</div>
                    <div className="mt-4 text-sm text-blue-100">
                        最後更新：{new Date().toLocaleTimeString()}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                        <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
                        <div className="text-sm text-gray-600">嚴重事件</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <Shield className="w-6 h-6 text-orange-600 mb-2" />
                        <div className="text-2xl font-bold text-orange-600">{highEvents}</div>
                        <div className="text-sm text-gray-600">高風險事件</div>
                    </div>
                </div>
            </div>

            {/* 嚴重程度分佈 */}
            <div className="bg-gray-50 rounded-lg p-6">
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

            {/* 快速操作 */}
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={handleEventsClick}
                    className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">查看事件</span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="flex items-center justify-center gap-2 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
                        >
                            <Network className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">查看網路</span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="flex items-center justify-center gap-2 p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors group"
                        >
                            <Crosshair className="w-5 h-5 text-violet-600" />
                            <span className="text-sm font-medium text-violet-700">威脅獵捕</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
