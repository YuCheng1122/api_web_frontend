'use client';

import { FC } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import type { ViewProps } from './types';

export const MobileView: FC<ViewProps> = ({
    frequencies,
    summary,
    maxCount,
    getColor
}) => {
    return (
        <div className="space-y-4">
            {/* 摘要卡片 */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Tactics</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{summary.activeTactics}</div>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                        <Activity className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-gray-700">Tech.</span>
                    </div>
                    <div className="text-lg font-bold text-amber-600">{summary.totalTechniques}</div>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-gray-700">High</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">{summary.highRiskTechniques}</div>
                </div>
            </div>

            {/* 簡化的戰術列表 */}
            <div className="space-y-2">
                {frequencies.map(({ tactic, techniques, total }) => (
                    <div key={tactic} className="bg-gray-50 rounded-lg p-2">
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-xs font-medium text-gray-900 line-clamp-1" title={tactic}>
                                {tactic}
                            </div>
                            <div className="text-xs text-gray-500">
                                {techniques.length} techniques
                            </div>
                        </div>
                        <div className="flex gap-1 overflow-x-auto pb-2">
                            {techniques.slice(0, 3).map(technique => (
                                <div
                                    key={technique.id}
                                    className="flex-shrink-0 px-2 py-1 rounded text-white text-xs"
                                    style={{ backgroundColor: getColor(technique.count) }}
                                >
                                    {technique.id}
                                </div>
                            ))}
                            {techniques.length > 3 && (
                                <div className="flex-shrink-0 px-2 py-1 rounded bg-gray-200 text-gray-600 text-xs">
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
