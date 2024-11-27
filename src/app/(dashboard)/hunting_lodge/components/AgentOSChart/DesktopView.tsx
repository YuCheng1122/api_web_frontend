'use client';

import { FC } from 'react';
import type { AgentOS } from '../../../../../features/dashboard_v2/types';
import { COLORS, getOSIcon } from './utils';

interface DesktopViewProps {
    osData: AgentOS['content']['agent_os'];
    total: number;
}

export const DesktopView: FC<DesktopViewProps> = ({ osData, total }) => {
    return (
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
                            <th className="text-left text-sm font-medium text-gray-500 pb-3">作業系統</th>
                            <th className="text-right text-sm font-medium text-gray-500 pb-3">數量</th>
                            <th className="text-right text-sm font-medium text-gray-500 pb-3">百分比</th>
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
                            <td className="py-3 text-sm font-medium text-gray-700">總計</td>
                            <td className="text-right text-sm font-medium text-gray-700">{total}</td>
                            <td className="text-right text-sm text-gray-700">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
