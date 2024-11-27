'use client';

import { FC } from 'react';
import type { Alerts } from '../../../../../features/dashboard_v2/types';
import { SEVERITY_CONFIG } from './constants';

interface DesktopViewProps {
    data: Alerts;
    total: number;
}

export const DesktopView: FC<DesktopViewProps> = ({ data, total }) => {
    return (
        <div className="space-y-6">
            {/* 水平條形圖 */}
            <div className="space-y-4">
                {SEVERITY_CONFIG.map((config) => {
                    const value = config.getValue(data);
                    const percentage = total > 0 ? (value / total * 100) : 0;
                    const Icon = config.icon;

                    return (
                        <div key={config.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {config.name}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {value} ({percentage.toFixed(1)}%)
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        backgroundColor: config.color,
                                        width: `${percentage}%`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 詳細統計 */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Total Alerts</div>
                        <div className="text-2xl font-bold text-gray-900">{total}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Critical + High</div>
                        <div className="text-2xl font-bold text-red-600">
                            {SEVERITY_CONFIG[0].getValue(data) + SEVERITY_CONFIG[1].getValue(data)}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    {SEVERITY_CONFIG[0].getValue(data) > 0 && (
                        <div className="text-red-600">
                            ⚠️ {SEVERITY_CONFIG[0].getValue(data)} critical alerts require immediate attention
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
