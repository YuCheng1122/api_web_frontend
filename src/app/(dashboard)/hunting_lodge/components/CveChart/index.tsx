'use client';

import { FC } from 'react';
import { ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface Props {
    data: CveBarchart[];
}

const CveChart: FC<Props> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-3 sm:p-4">
            <h2 className="text-base font-semibold mb-3">CVE 分析</h2>

            {/* 響應式統計區塊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞總數</span>
                        <span className="text-lg font-bold text-blue-600 ml-auto">{total}</span>
                    </div>
                </div>
                <div className="bg-amber-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">漏洞類型</span>
                        <span className="text-lg font-bold text-amber-600 ml-auto">{data.length}</span>
                    </div>
                </div>
            </div>

            {/* 響應式列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    return (
                        <div
                            key={item.cve_name}
                            className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.01]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <ShieldAlert
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                                style={{ color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm text-gray-900 truncate">
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

export default CveChart;
