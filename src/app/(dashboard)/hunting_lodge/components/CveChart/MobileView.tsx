'use client';

import { FC } from 'react';
import { ShieldAlert } from 'lucide-react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface MobileViewProps {
    cveData: CveBarchart[];
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({ cveData, total }) => {
    return (
        <div className="space-y-2">
            {/* 摘要統計 - 行內顯示 */}
            <div className="flex gap-2 mb-2">
                <div className="flex-1 bg-blue-50 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">漏洞總數</span>
                        <span className="text-lg font-bold text-blue-600">{total}</span>
                    </div>
                </div>
                <div className="flex-1 bg-amber-50 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">類型</span>
                        <span className="text-lg font-bold text-amber-600">{cveData.length}</span>
                    </div>
                </div>
            </div>

            {/* CVE列表 */}
            <div className="grid grid-cols-1 gap-1">
                {cveData.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    return (
                        <div
                            key={item.cve_name}
                            className="flex items-center p-2 rounded-lg"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <ShieldAlert
                                className="w-4 h-4 mr-2"
                                style={{ color }}
                            />
                            <span className="flex-1 text-xs text-gray-600 truncate">
                                {item.cve_name}
                            </span>
                            <span className="text-sm font-medium ml-2" style={{ color }}>
                                {item.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
