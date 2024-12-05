import { RuleMitreTactic, RuleMitreID } from '../../../../../features/dashboard_v2/types/event_table';

export interface TacticFrequency {
    tactic: RuleMitreTactic;
    techniques: {
        id: RuleMitreID;
        count: number;
        description: string;
    }[];
    total: number;
}

export interface Summary {
    totalTechniques: number;
    highRiskTechniques: number;
    activeTactics: number;
}

export interface ViewProps {
    frequencies: TacticFrequency[];
    summary: Summary;
    maxCount: number;
    getColor: (count: number) => string;
}
