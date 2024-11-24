'use client';

import type { AgentOS } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: AgentOS;
}

const COLORS = {
    'Microsoft Windows 10': '#3B82F6',  // blue-500
    'Microsoft Windows 11': '#10B981',  // emerald-500
    'macOS': '#F59E0B',                // amber-500
    'Ubuntu': '#6366F1',               // indigo-500
    'default': '#EC4899',              // pink-500
};

export default function AgentOSChart({ data }: Props) {
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Operating System Distribution</h2>
            <div className="grid grid-cols-3 gap-3">
                {osData.map((item, index) => {
                    const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                    const percentage = ((item.count / total) * 100).toFixed(1);

                    return (
                        <div
                            key={item.os}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="text-sm text-gray-600 truncate" title={item.os}>
                                {item.os}
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
        </div>
    );
}
