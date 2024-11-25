'use client';

import { useState, useEffect } from 'react';
import { Key, ShieldAlert, UserCheck } from 'lucide-react';
import type { Authentication } from '@/features/dashboard_v2/types';

interface Props {
    data: Authentication;
}

const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
];

export default function AuthenticationChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const tactics = data.content.authentication_piechart;
    const total = tactics.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // 移動端視圖
    const MobileView = () => (
        <div className="space-y-2">
            {tactics.map((item, index) => {
                const color = COLORS[index % COLORS.length];
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                return (
                    <div
                        key={item.tactic}
                        className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${color}10` }}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <Key
                                className="w-5 h-5"
                                style={{ color }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs text-gray-600 line-clamp-1"
                                title={item.tactic}
                            >
                                {item.tactic}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {percentage}% of total
                            </div>
                        </div>
                        <div
                            className="text-lg font-bold ml-3 whitespace-nowrap"
                            style={{ color }}
                        >
                            {item.count}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // 桌面端視圖
    const DesktopView = () => {
        const maxCount = Math.max(...tactics.map(t => t.count));

        return (
            <div className="space-y-6">
                {/* 水平條形圖 */}
                <div className="space-y-4">
                    {tactics.map((item, index) => {
                        const color = COLORS[index % COLORS.length];
                        const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                        const barWidth = (item.count / maxCount) * 100;

                        return (
                            <div key={item.tactic} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Key className="w-4 h-4" style={{ color }} />
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.tactic}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.count} ({percentage}%)
                                    </div>
                                </div>
                                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                                        style={{
                                            backgroundColor: color,
                                            width: `${barWidth}%`,
                                            minWidth: '40px'
                                        }}
                                    >
                                        <span className="text-xs font-medium text-white">
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 統計卡片 */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Total Events</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {total}
                        </div>
                        <div className="mt-2 text-sm text-blue-600">
                            Authentication attempts
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldAlert className="w-5 h-5 text-amber-600" />
                            <span className="text-sm font-medium text-gray-700">Top Tactic</span>
                        </div>
                        <div className="text-lg font-bold text-amber-600 line-clamp-1" title={tactics[0]?.tactic}>
                            {tactics[0]?.tactic || 'N/A'}
                        </div>
                        <div className="mt-2 text-sm text-amber-600">
                            {tactics[0]?.count || 0} events
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Authentication Tactics Distribution</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
