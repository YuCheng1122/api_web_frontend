'use client';

import { FC, useMemo } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import type { EventTable } from '../../../../../features/dashboard_v2/types';
import { calculateFrequencies, calculateMaxCount, calculateSummary, getColor } from './utils';

interface Props {
    data: EventTable;
}

const MitreHeatmapChart: FC<Props> = ({ data }) => {
    // Calculate frequencies of tactics and techniques
    const frequencies = useMemo(() => calculateFrequencies(data), [data]);

    // Calculate max count for color scaling
    const maxCount = useMemo(() => calculateMaxCount(frequencies), [frequencies]);

    // Calculate summary statistics
    const summary = useMemo(() => calculateSummary(frequencies, maxCount), [frequencies, maxCount]);

    // Create color getter function
    const colorGetter = (count: number) => getColor(count, maxCount);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE ATT&CK 矩陣</h2>

            {/* 摘要統計 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '活躍戰術' : 'Tactics'}
                        </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{summary.activeTactics}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-600 hidden sm:block">
                        使用中的戰術
                    </div>
                </div>
                <div className="bg-amber-50 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '技術總數' : 'Tech.'}
                        </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-amber-600">{summary.totalTechniques}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-amber-600 hidden sm:block">
                        已觀察到的獨特技術
                    </div>
                </div>
                <div className="bg-red-50 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '高風險' : 'High'}
                        </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-red-600">{summary.highRiskTechniques}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 hidden sm:block">
                        高風險技術
                    </div>
                </div>
            </div>

            {/* 戰術和技術列表 */}
            <div className="space-y-2 sm:space-y-4">
                {frequencies.map(({ tactic, techniques, total }) => (
                    <div key={tactic} className="bg-gray-50 rounded-lg p-2 sm:p-4">
                        <div className="flex justify-between items-center mb-1 sm:mb-3">
                            <div>
                                <div className="text-xs sm:text-base font-medium text-gray-900 line-clamp-1" title={tactic}>
                                    {tactic}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {techniques.length} {window.innerWidth >= 640 ? '個技術，' : ' tech, '}
                                    {total} {window.innerWidth >= 640 ? '個事件' : ' events'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                            {techniques.map(technique => (
                                <div
                                    key={technique.id}
                                    className="relative group"
                                >
                                    <div
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded text-white text-xs sm:text-sm transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: colorGetter(technique.count)
                                        }}
                                    >
                                        {technique.id} {window.innerWidth >= 640 && `(${technique.count})`}
                                    </div>
                                    {/* 提示框 - 僅在桌面版顯示 */}
                                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-0 mb-2 hidden sm:block">
                                        <div className="font-medium mb-1">{technique.id}</div>
                                        <div className="text-gray-300">{technique.description}</div>
                                        <div className="mt-1 text-gray-400">數量：{technique.count}</div>
                                        <div className="absolute bottom-[-6px] left-4 w-3 h-3 rotate-45 bg-gray-900"></div>
                                    </div>
                                </div>
                            ))}
                            {/* 在移動端只顯示前3個技術 */}
                            {window.innerWidth < 640 && techniques.length > 3 && (
                                <div className="px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">
                                    +{techniques.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MitreHeatmapChart;
