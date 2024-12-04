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
        <div className="space-y-4">
            {/* 摘要統計 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞總數</span>
                        <span className="text-lg font-bold text-blue-600 ml-auto">{total}</span>
                    </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞類型</span>
                        <span className="text-lg font-bold text-amber-600 ml-auto">{cveData.length}</span>
                    </div>
                </div>
            </div>

            {/* 詳細列表 */}
            <div className="grid grid-cols-2 gap-2">
                {cveData.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    return (
                        <div
                            key={item.cve_name}
                            className="flex items-center p-2 rounded-lg"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <ShieldAlert
                                className="w-5 h-5 mr-2 flex-shrink-0"
                                style={{ color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 truncate">
                                    {item.cve_name}
                                </div>
                            </div>
                            <div className="text-sm font-medium ml-2" style={{ color }}>
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
