'use client';

import { FC, useMemo } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { EventTable } from '../../../../../features/dashboard_v2/types';
import { RuleMitreTactic, RuleMitreID } from '../../../../../features/dashboard_v2/types/event_table';

// Enhanced color configuration
const CELL_COLORS = {
    low: {
        base: 'hsl(150, 75%, 40%)',  // Rich green
        gradient: 'linear-gradient(45deg, hsl(150, 75%, 40%), hsl(160, 75%, 45%))'
    },
    medium: {
        base: 'hsl(25, 85%, 55%)',   // Warm orange
        gradient: 'linear-gradient(45deg, hsl(25, 85%, 55%), hsl(35, 85%, 60%))'
    },
    high: {
        base: 'hsl(0, 85%, 60%)',    // Bright red
        gradient: 'linear-gradient(45deg, hsl(0, 85%, 60%), hsl(10, 85%, 65%))'
    }
} as const;

// Types
interface TacticFrequency {
    tactic: RuleMitreTactic;
    techniques: {
        id: RuleMitreID;
        count: number;
        description: string;
    }[];
    total: number;
}

interface Summary {
    totalTechniques: number;
    highRiskTechniques: number;
    activeTactics: number;
}

// Utility Functions
const calculateFrequencies = (data: EventTable | null): TacticFrequency[] => {
    if (!data) return [];

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

        if (total > 0) {
            result.push({
                tactic,
                techniques,
                total
            });
        }
    });

    return result.sort((a, b) => b.total - a.total);
};

const calculateMaxCount = (frequencies: TacticFrequency[]): number => {
    let max = 0;
    frequencies.forEach(tf => {
        tf.techniques.forEach(t => {
            if (t.count > max) max = t.count;
        });
    });
    return max;
};

const calculateSummary = (frequencies: TacticFrequency[], maxCount: number): Summary => {
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
};

const getColor = (count: number, maxCount: number): typeof CELL_COLORS[keyof typeof CELL_COLORS] => {
    const ratio = count / maxCount;
    if (ratio > 0.66) return CELL_COLORS.high;
    if (ratio > 0.33) return CELL_COLORS.medium;
    return CELL_COLORS.low;
};

const MitreHeatmapChart: FC = () => {
    const { eventTable } = useDashboard();

    const frequencies = useMemo(() => calculateFrequencies(eventTable), [eventTable]);
    const maxCount = useMemo(() => calculateMaxCount(frequencies), [frequencies]);
    const summary = useMemo(() => calculateSummary(frequencies, maxCount), [frequencies, maxCount]);
    const colorGetter = (count: number) => getColor(count, maxCount);

    if (!eventTable || frequencies.length === 0) {
        return (
            <div className="w-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">MITRE ATT&CK 矩陣</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">MITRE ATT&CK 矩陣</h2>

            {/* 摘要統計 */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-accent/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: CELL_COLORS.low.base }} />
                        <span className="text-sm font-medium text-card-foreground">活躍戰術</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: CELL_COLORS.low.base }}>
                        {summary.activeTactics}
                    </div>
                    <div className="mt-2 text-sm hidden sm:block" style={{ color: CELL_COLORS.low.base }}>
                        使用中的戰術
                    </div>
                </div>
                <div className="bg-accent/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: CELL_COLORS.medium.base }} />
                        <span className="text-sm font-medium text-card-foreground">技術總數</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: CELL_COLORS.medium.base }}>
                        {summary.totalTechniques}
                    </div>
                    <div className="mt-2 text-sm hidden sm:block" style={{ color: CELL_COLORS.medium.base }}>
                        已觀察到的獨特技術
                    </div>
                </div>
                <div className="bg-accent/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: CELL_COLORS.high.base }} />
                        <span className="text-sm font-medium text-card-foreground">高風險</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: CELL_COLORS.high.base }}>
                        {summary.highRiskTechniques}
                    </div>
                    <div className="mt-2 text-sm hidden sm:block" style={{ color: CELL_COLORS.high.base }}>
                        高風險技術
                    </div>
                </div>
            </div>

            {/* 戰術和技術列表 */}
            <div className="space-y-3 sm:space-y-4">
                {frequencies.map(({ tactic, techniques, total }) => (
                    <div key={tactic} className="bg-accent/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-accent/70 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <div className="text-sm sm:text-base font-medium text-card-foreground line-clamp-1" title={tactic}>
                                    {tactic}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {techniques.length} 個技術，{total} 個事件
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {techniques.map(technique => {
                                const color = colorGetter(technique.count);
                                return (
                                    <div
                                        key={technique.id}
                                        className="relative group"
                                    >
                                        <div
                                            className="px-3 py-1.5 rounded text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                            style={{
                                                background: color.gradient,
                                                boxShadow: `0 0 10px ${color.base}40`
                                            }}
                                        >
                                            {technique.id} ({technique.count})
                                        </div>
                                        {/* 提示框 */}
                                        <div className="absolute z-10 invisible group-hover:visible bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg py-3 px-4 w-72 bottom-full left-0 mb-2 hidden sm:block border border-border shadow-lg">
                                            <div className="font-medium mb-2" style={{ color: color.base }}>{technique.id}</div>
                                            <div className="text-muted-foreground leading-relaxed">{technique.description}</div>
                                            <div className="mt-2 font-medium" style={{ color: color.base }}>事件數量：{technique.count}</div>
                                            <div className="absolute bottom-[-6px] left-4 w-3 h-3 rotate-45 bg-popover/95 backdrop-blur-sm border-r border-b border-border"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MitreHeatmapChart;
