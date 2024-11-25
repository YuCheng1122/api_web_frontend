'use client';

import { useMemo } from 'react';
import type { EventTable } from '@/features/dashboard_v2/types';
import type { RuleMitreTactic, RuleMitreID } from '@/features/dashboard_v2/types/event_table';
import { RuleMitreTactic as RuleMitreTacticEnum, RuleMitreID as RuleMitreIDEnum } from '@/features/dashboard_v2/types/event_table';

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
    // Calculate frequencies of tactics and techniques
    const frequencies = useMemo(() => {
        const tacticMap = new Map<RuleMitreTactic, Map<RuleMitreID, { count: number; description: string }>>();

        Object.values(RuleMitreTacticEnum).forEach(tactic => {
            if (tactic !== RuleMitreTacticEnum.Empty) {
                tacticMap.set(tactic, new Map());
            }
        });

        data.content.event_table.forEach(event => {
            if (event.rule_mitre_tactic === RuleMitreTacticEnum.Empty ||
                event.rule_mitre_id === RuleMitreIDEnum.Empty) {
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

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE ATT&CK Matrix</h2>
            <div className="space-y-3">
                {frequencies.map(({ tactic, techniques, total }) => (
                    <div key={tactic} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="text-sm sm:text-base font-medium text-gray-900">
                                    {tactic}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                    {total} events
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {techniques.map(technique => (
                                <div
                                    key={technique.id}
                                    className="relative group"
                                >
                                    <div
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded text-white text-xs sm:text-sm transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: getColor(technique.count)
                                        }}
                                    >
                                        {technique.id} ({technique.count})
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 w-48 sm:w-64 bottom-full left-0 mb-2">
                                        <div className="font-medium mb-1">{technique.id}</div>
                                        <div className="text-gray-300 text-xs">{technique.description}</div>
                                        <div className="mt-1 text-gray-400 text-xs">Count: {technique.count}</div>
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
}
