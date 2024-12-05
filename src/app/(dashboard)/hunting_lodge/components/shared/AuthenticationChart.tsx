'use client';

import { FC } from 'react';
import { Key, ShieldAlert, UserCheck } from 'lucide-react';
import type { Authentication } from '../../../../../features/dashboard_v2/types';

// 原 constants.ts 中的顏色配置
const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
] as const;

interface Props {
    data: Authentication;
}

const AuthenticationChart: FC<Props> = ({ data }) => {
    const tactics = data.content.authentication_piechart;
    const total = tactics.reduce((sum, item) => sum + item.count, 0);
    const maxCount = Math.max(...tactics.map(t => t.count));

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">身份驗證策略分佈</h2>

            {/* 統計卡片 - 在移動端顯示在底部，在桌面端顯示在底部 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-0 order-1 sm:order-2">
                <div className="bg-blue-50 rounded-lg p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '事件總數' : 'Total'}
                        </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                        {total}
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-600 hidden sm:block">
                        驗證嘗試次數
                    </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '主要策略' : 'Main'}
                        </span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-amber-600 line-clamp-1" title={tactics[0]?.tactic}>
                        {tactics[0]?.tactic || '無資料'}
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-600 hidden sm:block">
                        {tactics[0]?.count || 0} 個事件
                    </div>
                </div>
            </div>

            {/* 主要內容區域 */}
            <div className="space-y-2 sm:space-y-4 order-2 sm:order-1 mt-3 sm:mt-6">
                {tactics.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                    const barWidth = (item.count / maxCount) * 100;

                    return (
                        <div
                            key={item.tactic}
                            className="sm:space-y-2"
                        >
                            {/* 移動端顯示 */}
                            <div className="flex sm:hidden items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                                style={{ backgroundColor: `${color}10` }}
                            >
                                <div className="flex-shrink-0 mr-3">
                                    <Key
                                        className="w-5 h-5"
                                        style={{ color }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-gray-600 line-clamp-1" title={item.tactic}>
                                        {item.tactic}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {percentage}% of total
                                    </div>
                                </div>
                                <div className="text-lg font-bold ml-3 whitespace-nowrap" style={{ color }}>
                                    {item.count}
                                </div>
                            </div>

                            {/* 桌面端顯示 */}
                            <div className="hidden sm:block space-y-2">
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AuthenticationChart;
