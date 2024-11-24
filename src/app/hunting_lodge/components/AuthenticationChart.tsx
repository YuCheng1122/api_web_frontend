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
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Authentication Tactics Distribution</h2>
            <div className="grid grid-cols-2 gap-3">
                {tactics.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.tactic}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="text-sm text-gray-600 truncate" title={item.tactic}>
                                {item.tactic}
                            </div>
                            <div
                                className="text-xl font-bold"
                                style={{ color }}
                            >
                                {item.count}
                            </div>
                            <div className="text-sm text-gray-500">
                                {percentage}% of total
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
                Total Authentication Events: {total}
            </div>
        </div>
    );
}
