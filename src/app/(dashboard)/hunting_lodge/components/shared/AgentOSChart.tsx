'use client';

import { FC } from 'react';
import type { AgentOS } from '../../../../../features/dashboard_v2/types';

// 原 utils.ts 中的常數和函數
const COLORS = {
    'Microsoft Windows 10': 'var(--chart-1)',
    'Microsoft Windows 11': 'var(--chart-2)',
    'macOS': 'var(--chart-3)',
    'Ubuntu': 'var(--chart-4)',
    'default': 'var(--chart-5)'
} as const;

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

interface Props {
    data: AgentOS;
}

const AgentOSChart: FC<Props> = ({ data }) => {
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">作業系統分佈</h2>

            {/* 移動端列表視圖 */}
            <div className="grid grid-cols-1 gap-2 sm:hidden">
                {osData.map((item) => {
                    const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                    const percentage = ((item.count / total) * 100).toFixed(1);
                    const iconClass = getOSIcon(item.os);

                    return (
                        <div
                            key={item.os}
                            className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02] bg-muted"
                        >
                            <div className="flex-shrink-0 mr-3">
                                <i
                                    className={`${iconClass} text-xl`}
                                    style={{ color: `hsl(${color})` }}
                                ></i>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className="text-xs text-muted-foreground line-clamp-2"
                                    title={item.os}
                                >
                                    {item.os}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {percentage}% of total
                                </div>
                            </div>
                            <div
                                className="text-lg font-bold ml-3 whitespace-nowrap"
                                style={{ color: `hsl(${color})` }}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 桌面端視圖 */}
            <div className="hidden sm:block space-y-6">
                {/* 柱狀圖 */}
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
                                <div className="text-sm font-medium text-muted-foreground">
                                    {item.count}
                                </div>
                                <div
                                    className="w-full rounded-t-lg transition-all duration-500 ease-in-out"
                                    style={{
                                        backgroundColor: `hsl(${color})`,
                                        height: `${Math.max(percentage, 5)}%`,
                                        opacity: 0.8
                                    }}
                                />
                                <i
                                    className={`${iconClass} text-2xl`}
                                    style={{ color: `hsl(${color})` }}
                                ></i>
                            </div>
                        );
                    })}
                </div>

                {/* 詳細資訊表格 */}
                <div className="bg-muted rounded-lg p-4">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left text-sm font-medium text-muted-foreground pb-3">作業系統</th>
                                <th className="text-right text-sm font-medium text-muted-foreground pb-3">數量</th>
                                <th className="text-right text-sm font-medium text-muted-foreground pb-3">百分比</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
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
                                                    style={{ color: `hsl(${color})` }}
                                                ></i>
                                                <span className="text-sm text-card-foreground">{item.os}</span>
                                            </div>
                                        </td>
                                        <td className="text-right text-sm font-medium" style={{ color: `hsl(${color})` }}>
                                            {item.count}
                                        </td>
                                        <td className="text-right text-sm text-muted-foreground">
                                            {percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="border-t border-border">
                            <tr>
                                <td className="py-3 text-sm font-medium text-card-foreground">總計</td>
                                <td className="text-right text-sm font-medium text-card-foreground">{total}</td>
                                <td className="text-right text-sm text-card-foreground">100%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentOSChart;
