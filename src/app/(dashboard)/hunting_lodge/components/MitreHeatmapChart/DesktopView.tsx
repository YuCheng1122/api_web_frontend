'use client';

import { FC } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import type { ViewProps } from './types';

export const DesktopView: FC<ViewProps> = ({
    frequencies,
    summary,
    maxCount,
    getColor
}) => {
    return (
        <div className="space-y-6">
            {/* 摘要統計 */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">活躍戰術</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{summary.activeTactics}</div>
                    <div className="mt-2 text-sm text-blue-600">
                        使用中的戰術
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">技術總數</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{summary.totalTechniques}</div>
                    <div className="mt-2 text-sm text-amber-600">
                        已觀察到的獨特技術
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">高風險</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{summary.highRiskTechniques}</div>
                    <div className="mt-2 text-sm text-red-600">
                        高風險技術
                    </div>
                </div>
            </div>

            {/* 詳細的戰術和技術列表 */}
            <div className="space-y-4">
                {frequencies.map(({ tactic, techniques, total }) => (
                    <div key={tactic} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <div className="text-base font-medium text-gray-900">
                                    {tactic}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {techniques.length} 個技術，{total} 個事件
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {techniques.map(technique => (
                                <div
                                    key={technique.id}
                                    className="relative group"
                                >
                                    <div
                                        className="px-3 py-1.5 rounded text-white text-sm transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: getColor(technique.count)
                                        }}
                                    >
                                        {technique.id} ({technique.count})
                                    </div>
                                    {/* 提示框 */}
                                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-0 mb-2">
                                        <div className="font-medium mb-1">{technique.id}</div>
                                        <div className="text-gray-300">{technique.description}</div>
                                        <div className="mt-1 text-gray-400">數量：{technique.count}</div>
                                        {/* 箭頭 */}
                                        <div className="absolute bottom-[-6px] left-4 w-3 h-3 rotate-45 bg-gray-900"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
