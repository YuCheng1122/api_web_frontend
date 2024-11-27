import type { EventTable } from '../../../../../features/dashboard_v2/types';
import { RuleMitreTactic, RuleMitreID } from '../../../../../features/dashboard_v2/types/event_table';
import type { TacticFrequency, Summary } from './types';
import { CELL_COLORS } from './constants';

export const calculateFrequencies = (data: EventTable): TacticFrequency[] => {
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
};

export const calculateMaxCount = (frequencies: TacticFrequency[]): number => {
    let max = 0;
    frequencies.forEach(tf => {
        tf.techniques.forEach(t => {
            if (t.count > max) max = t.count;
        });
    });
    return max;
};

export const calculateSummary = (frequencies: TacticFrequency[], maxCount: number): Summary => {
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

export const getColor = (count: number, maxCount: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.66) return CELL_COLORS.high;
    if (ratio > 0.33) return CELL_COLORS.medium;
    return CELL_COLORS.low;
};
