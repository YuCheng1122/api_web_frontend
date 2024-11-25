'use client';

import { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import type { EventTable } from '@/features/dashboard_v2/types';
import { RuleMitreTactic, RuleMitreID } from '@/features/dashboard_v2/types/event_table';

interface Props {
    data: EventTable;
}

interface TacticFrequency {
    tactic: RuleMitreTactic;
    techniques: {
        id: RuleMitreID;
        count: number;
        description: string;
    }[];
    total: number;
}

const CELL_COLORS = {
    low: '#10B981',    // emerald-500
    medium: '#F59E0B', // amber-500
    high: '#EF4444',   // red-500
};

export default function MitreHeatmapChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Calculate frequencies of tactics and techniques
    const frequencies = useMemo(() => {
        const tacticMap = new Map<RuleMitreTactic, Map<RuleMitreID, { count: number; description: string }>>();

        Object.values(RuleMitreTactic).forEach(tactic => {
            if (tactic !== RuleMitreTactic.Empty) {
                tacticMap.set(tactic, new Map());
            }
        });

        data.content.event_table.forEach(event => {
            if (event.rule_mitre_tactic === RuleMitreTactic.Empty ||
                event.rule_mitre_id === RuleMitreID.Empty) {
                return;
            }

            const techniqueMap = tacticMap.get(event.rule_mitre_tactic);
            if (techniqueMap) {
                const current = techniqueMap.get(event.rule_mitre_id);
                if (current) {
                    techniqueMap.set(event.rule_mitre_id, {
                        count: current.count + 1,
                        description: event.rule_description
                    });
                } else {
                    techniqueMap.set(event.rule_mitre_id, {
                        count: 1,
                        description: event.rule_description
                    });
                }
            }
        });

        const result: TacticFrequency[] = [];
        tacticMap.forEach((techniqueMap, tactic) => {
            const techniques = Array.from(techniqueMap.entries()).map(([id, data]) => ({
                id,
                count: data.count,
                description: data.description
            }));

            const total = techniques.reduce((sum, t) => sum + t.count, 0);

            if (total > 0) { // 只顯示有事件的戰術
                result.push({
                    tactic,
                    techniques,
                    total
                });
            }
        });

        return result.sort((a, b) => b.total - a.total);
    }, [data]);

    const maxCount = useMemo(() => {
        let max = 0;
        frequencies.forEach(tf => {
            tf.techniques.forEach(t => {
                if (t.count > max) max = t.count;
            });
        });
        return max;
    }, [frequencies]);

    const getColor = (count: number) => {
        const ratio = count / maxCount;
        if (ratio > 0.66) return CELL_COLORS.high;
        if (ratio > 0.33) return CELL_COLORS.medium;
        return CELL_COLORS.low;
    };

    // 計算摘要數據
    const summary = useMemo(() => {
        let totalTechniques = 0;
        let highRiskTechniques = 0;
        let activeTactics = frequencies.length;

        frequencies.forEach(({ techniques }) => {
            totalTechniques += techniques.length;
            techniques.forEach(t => {
                if (t.count / maxCount > 0.66) {
                    highRiskTechniques++;
                }
            });
        });

        return { totalTechniques, highRiskTechniques, activeTactics };
    }, [frequencies, maxCount]);

    // 移動端視圖
    const MobileView = () => (
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

    // 桌面端視圖
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 摘要統計 */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Active Tactics</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{summary.activeTactics}</div>
                    <div className="mt-2 text-sm text-blue-600">
                        Tactics in use
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">Total Techniques</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{summary.totalTechniques}</div>
                    <div className="mt-2 text-sm text-amber-600">
                        Unique techniques observed
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">High Risk</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{summary.highRiskTechniques}</div>
                    <div className="mt-2 text-sm text-red-600">
                        High risk techniques
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
                                    {techniques.length} techniques, {total} events
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
                                    {/* Tooltip */}
                                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-64 bottom-full left-0 mb-2">
                                        <div className="font-medium mb-1">{technique.id}</div>
                                        <div className="text-gray-300">{technique.description}</div>
                                        <div className="mt-1 text-gray-400">Count: {technique.count}</div>
                                        {/* Arrow */}
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

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE ATT&CK Matrix</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
