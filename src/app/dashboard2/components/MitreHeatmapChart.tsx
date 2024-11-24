'use client';

import { useMemo } from 'react';
import type { EventTable } from '@/features/dashboard2.0/types/generated';
import { RuleMitreTactic, RuleMitreID } from '@/features/dashboard2.0/types/generated/event_table';

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

        // Initialize with empty maps for each tactic
        Object.values(RuleMitreTactic).forEach(tactic => {
            if (tactic !== RuleMitreTactic.Empty) {
                tacticMap.set(tactic, new Map());
            }
        });

        // Count occurrences
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

        // Convert to array format
        const result: TacticFrequency[] = [];
        tacticMap.forEach((techniqueMap, tactic) => {
            const techniques = Array.from(techniqueMap.entries()).map(([id, data]) => ({
                id,
                count: data.count,
                description: data.description
            }));

            const total = techniques.reduce((sum, t) => sum + t.count, 0);

            result.push({
                tactic,
                techniques,
                total
            });
        });

        return result.sort((a, b) => b.total - a.total);
    }, [data]);

    // Find the maximum count for color scaling
    const maxCount = useMemo(() => {
        let max = 0;
        frequencies.forEach(tf => {
            tf.techniques.forEach(t => {
                if (t.count > max) max = t.count;
            });
        });
        return max;
    }, [frequencies]);

    // Get color based on count
    const getColor = (count: number) => {
        const ratio = count / maxCount;
        if (ratio > 0.66) return CELL_COLORS.high;
        if (ratio > 0.33) return CELL_COLORS.medium;
        return CELL_COLORS.low;
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">MITRE ATT&CK Matrix</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">
                                Tactic
                            </th>
                            <th className="px-4 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500">
                                Techniques
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {frequencies.map(({ tactic, techniques, total }) => (
                            <tr key={tactic} className="border-t">
                                <td className="px-4 py-4 align-top">
                                    <div className="text-sm font-medium text-gray-900">
                                        {tactic}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {total} events
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {techniques.map(technique => (
                                            <div
                                                key={technique.id}
                                                className="relative group"
                                            >
                                                <div
                                                    className="px-3 py-2 rounded-lg text-white text-sm transition-transform hover:scale-105"
                                                    style={{
                                                        backgroundColor: getColor(technique.count)
                                                    }}
                                                >
                                                    {technique.id} ({technique.count})
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded-lg py-2 px-3 w-64 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                                                    <div className="font-medium mb-1">{technique.id}</div>
                                                    <div className="text-gray-300">{technique.description}</div>
                                                    <div className="mt-1 text-gray-400">Count: {technique.count}</div>
                                                    {/* Arrow */}
                                                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-900"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
