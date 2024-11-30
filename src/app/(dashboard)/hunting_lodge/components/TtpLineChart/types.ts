import type { TtpLinechart } from '../../../../../features/dashboard_v2/types';

export interface TimePoint {
    time: string;
    [key: string]: string | number;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

export interface ViewProps {
    timePoints: TimePoint[];
    chartData: TtpLinechart['content']['tactic_linechart'][0];
    criticalCount: number;
    increasingTrends: number;
    getSeriesColor: (seriesName: string) => string;
}

export interface TrendSummary {
    criticalCount: number;
    increasingTrends: number;
}
