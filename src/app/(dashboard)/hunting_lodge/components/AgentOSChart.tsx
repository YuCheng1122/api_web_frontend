'use client';

import { useState, useEffect } from 'react';
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
    const [isMobile, setIsMobile] = useState(false);
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

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
        <div className="grid grid-cols-1 gap-2">
            {osData.map((item) => {
                const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                const percentage = ((item.count / total) * 100).toFixed(1);
                const iconClass = getOSIcon(item.os);

                return (
                    <div
                        key={item.os}
                        className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${color}10` }}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <i
                                className={`${iconClass} text-xl`}
                                style={{ color }}
                            ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs text-gray-600 line-clamp-2"
                                title={item.os}
                            >
                                {item.os}
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
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 圖表視圖 */}
            <div className="flex h-[200px] items-end gap-4 px-4">
                {osData.map((item) => {
                    const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                    const percentage = (item.count / total) * 100;
                    const iconClass = getOSIcon(item.os);

                    return (
                        <div
                            key={item.os}
                            className="flex flex-col items-center gap-2 flex-1"
                        >
                            <div className="text-sm font-medium text-gray-500">
                                {item.count}
                            </div>
                            <div
                                className="w-full rounded-t-lg transition-all duration-500 ease-in-out"
                                style={{
                                    backgroundColor: color,
                                    height: `${Math.max(percentage, 5)}%`,
                                    opacity: 0.8
                                }}
                            />
                            <i
                                className={`${iconClass} text-2xl`}
                                style={{ color }}
                            ></i>
                        </div>
                    );
                })}
            </div>

            {/* 詳細資訊表格 */}
            <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm font-medium text-gray-500 pb-3">Operating System</th>
                            <th className="text-right text-sm font-medium text-gray-500 pb-3">Count</th>
                            <th className="text-right text-sm font-medium text-gray-500 pb-3">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {osData.map((item) => {
                            const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                            const percentage = ((item.count / total) * 100).toFixed(1);
                            const iconClass = getOSIcon(item.os);

                            return (
                                <tr key={item.os} className="group">
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <i
                                                className={`${iconClass} text-xl`}
                                                style={{ color }}
                                            ></i>
                                            <span className="text-sm text-gray-700">{item.os}</span>
                                        </div>
                                    </td>
                                    <td className="text-right text-sm font-medium" style={{ color }}>
                                        {item.count}
                                    </td>
                                    <td className="text-right text-sm text-gray-500">
                                        {percentage}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="border-t border-gray-200">
                        <tr>
                            <td className="py-3 text-sm font-medium text-gray-700">Total</td>
                            <td className="text-right text-sm font-medium text-gray-700">{total}</td>
                            <td className="text-right text-sm text-gray-700">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Operating System Distribution</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
