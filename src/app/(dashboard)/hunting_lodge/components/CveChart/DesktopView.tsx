'use client';

import { FC } from 'react';
import { ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface DesktopViewProps {
    cveData: CveBarchart[];
    total: number;
}

export const DesktopView: FC<DesktopViewProps> = ({ cveData, total }) => {
    return (
        <div className="space-y-6">
            {/* 摘要統計 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞總數</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{total}</div>
                    <div className="mt-2 text-sm text-blue-600">
                        已偵測到的CVE漏洞
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞類型</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{cveData.length}</div>
                    <div className="mt-2 text-sm text-amber-600">
                        獨特CVE類別
                    </div>
                </div>
            </div>

            {/* 詳細列表 */}
            <div className="space-y-3">
                {cveData.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.cve_name}
                            className="flex items-start p-3 rounded-lg transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="flex-shrink-0 mr-4 mt-1">
                                <ShieldAlert
                                    className="w-6 h-6"
                                    style={{ color }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="text-sm font-medium text-gray-900 line-clamp-2"
                                            title={item.cve_name}
                                        >
                                            {item.cve_name}
                                        </div>
                                    </div>
                                    <div
                                        className="flex-shrink-0 text-sm font-medium"
                                        style={{ color }}
                                    >
                                        {percentage}%
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <div className="flex-shrink-0 text-sm text-gray-500 min-w-[100px]">
                                        數量：{item.count}
                                    </div>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: color,
                                                width: `${percentage}%`
                                            }}
                                        />
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
