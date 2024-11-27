'use client';

import { FC } from 'react';
import { Key, ShieldAlert, UserCheck } from 'lucide-react';
import type { Authentication } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface DesktopViewProps {
    tactics: Authentication['content']['authentication_piechart'];
    total: number;
}

export const DesktopView: FC<DesktopViewProps> = ({ tactics, total }) => {
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
