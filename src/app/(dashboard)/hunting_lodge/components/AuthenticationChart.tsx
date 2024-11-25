'use client';

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
    const tactics = data.content.authentication_piechart;
    const total = tactics.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Authentication Tactics Distribution</h2>
            {/* 在移動端改為單列顯示 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {tactics.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.tactic}
                            className="p-2 sm:p-3 rounded-lg flex items-center justify-between sm:block"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="flex-1 min-w-0">
                                <div
                                    className="text-xs sm:text-sm text-gray-600 truncate"
                                    title={item.tactic}
                                >
                                    {item.tactic}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                                    {percentage}% of total
                                </div>
                            </div>
                            <div
                                className="text-lg sm:text-xl font-bold ml-3 sm:ml-0 whitespace-nowrap"
                                style={{ color }}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
                Total Authentication Events: {total}
            </div>
        </div>
    );
}
