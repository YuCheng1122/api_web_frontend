import type { TtpLinechart, TtpLinechartTypes } from '../../../../../features/dashboard_v2/types';
import type { TimePoint, TrendSummary } from './types';
import { TTP_COLORS } from './constants';

export const transformDataForCharts = (chartData: TtpLinechart['content']['tactic_linechart'][0]): TimePoint[] => {
    if (!chartData) return [];

    return chartData.datas[0]?.data.map((point: TtpLinechartTypes.Datum) => ({
        time: new Date(point.time).toLocaleString(),
        ...chartData.datas.reduce((acc: Record<string, number>, series: TtpLinechartTypes.Data) => ({
            ...acc,
            [series.name]: series.data.find((d: TtpLinechartTypes.Datum) => d.time === point.time)?.value || 0
        }), {} as Record<string, number>)
    })) || [];
};

export const calculateTrendSummary = (timePoints: TimePoint[]): TrendSummary => {
    const lastPoint = timePoints[timePoints.length - 1];
    const prevPoint = timePoints[timePoints.length - 2];
    let criticalCount = 0;
    let increasingTrends = 0;

    if (lastPoint) {
        Object.entries(lastPoint).forEach(([key, value]) => {
            if (key === 'time' || typeof value !== 'number') return;
            if (value >= 10) criticalCount++;
            if (prevPoint && value > (prevPoint[key] as number)) increasingTrends++;
        });
    }

    return { criticalCount, increasingTrends };
};

export const getSeriesColor = (seriesName: string): string => 
    TTP_COLORS[seriesName as keyof typeof TTP_COLORS] || '#6B7280';
