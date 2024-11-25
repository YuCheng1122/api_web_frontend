'use client';

import type { AgentOS } from '@/features/dashboard_v2/types';

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

const getOSIcon = (os: string): string => {
    if (os.toLowerCase().includes('windows')) {
        return 'fa-brands fa-windows';
    }
    if (os.toLowerCase().includes('macos')) {
        return 'fa-brands fa-apple';
    }
    if (os.toLowerCase().includes('ubuntu') || os.toLowerCase().includes('linux')) {
        return 'fa-brands fa-linux';
    }
    return 'fa-brands fa-windows';
};

export default function AgentOSChart({ data }: Props) {
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Operating System Distribution</h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {osData.map((item, index) => {
                    const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    const iconClass = getOSIcon(item.os);

                    return (
                        <div
                            key={item.os}
                            className="flex items-center p-2 sm:p-3 rounded-lg transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            {/* OS Icon */}
                            <div className="flex-shrink-0 mr-3">
                                <i
                                    className={`${iconClass} text-xl sm:text-2xl`}
                                    style={{ color }}
                                ></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className="text-xs sm:text-sm text-gray-600 line-clamp-2"
                                    title={item.os}
                                >
                                    {item.os}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                                    {percentage}% of total
                                </div>
                            </div>
                            <div
                                className="text-lg sm:text-xl font-bold ml-3 sm:ml-4 whitespace-nowrap"
                                style={{ color }}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
                Total Agents: {total}
            </div>
        </div>
    );
}
