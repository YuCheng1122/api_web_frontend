'use client';

import { FC } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { TtpLinechart, TtpLinechartTypes } from '../../../../../features/dashboard_v2/types';

// Constants
const TTP_COLORS: { [key: string]: string } = {
    'Initial Access': '#2563EB',      // Blue
    'Execution': '#DC2626',           // Red
    'Persistence': '#9333EA',         // Purple
    'Privilege Escalation': '#EA580C', // Orange
    'Defense Evasion': '#059669',     // Green
    'Credential Access': '#CA8A04',    // Yellow
    'Discovery': '#0891B2',           // Cyan
    'Lateral Movement': '#BE185D',    // Pink
    'Collection': '#4F46E5',          // Indigo
    'Command and Control': '#7C3AED', // Violet
    'Exfiltration': '#B91C1C',        // Dark Red
    'Impact': '#15803D',              // Dark Green
} as const;

// Types
interface TimePoint {
    time: string;
    [key: string]: string | number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

interface TrendSummary {
    criticalCount: number;
    increasingTrends: number;
}

// Utility Functions
const transformDataForCharts = (chartData: TtpLinechart['content']['tactic_linechart'][0]): TimePoint[] => {
    if (!chartData) return [];

    return chartData.datas[0]?.data.map((point: TtpLinechartTypes.Datum) => ({
        time: new Date(point.time).toLocaleString(),
        ...chartData.datas.reduce((acc: Record<string, number>, series: TtpLinechartTypes.Data) => ({
            ...acc,
            [series.name]: series.data.find((d: TtpLinechartTypes.Datum) => d.time === point.time)?.value || 0
        }), {} as Record<string, number>)
    })) || [];
};

const calculateTrendSummary = (timePoints: TimePoint[]): TrendSummary => {
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

const getSeriesColor = (seriesName: string): string =>
    TTP_COLORS[seriesName as keyof typeof TTP_COLORS] || '#6B7280';

// CustomTooltip Component
const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 max-w-[280px] sm:max-w-none">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {new Date(label || '').toLocaleString()}
            </p>
            <div className="space-y-1 sm:space-y-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                style={{ backgroundColor: getSeriesColor(entry.name) }}
                            />
                            <span className="text-xs sm:text-sm text-gray-700">{entry.name}</span>
                        </div>
                        <span
                            className="text-xs sm:text-sm font-medium"
                            style={{ color: getSeriesColor(entry.name) }}
                        >
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Component
interface Props {
    data: TtpLinechart;
}

const TtpLineChart: FC<Props> = ({ data }) => {
    const chartData = data.content.tactic_linechart[0];
    if (!chartData) return null;

    // Transform data for charts
    const timePoints = transformDataForCharts(chartData);
    const recentTimePoints = timePoints.slice(-5);

    // Calculate trend summary
    const { criticalCount, increasingTrends } = calculateTrendSummary(timePoints);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE 戰術時間分佈</h2>

            {/* 趨勢摘要卡片 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '嚴重戰術' : 'Critical'}
                        </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">{criticalCount}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-orange-600 hidden sm:block">
                        具有嚴重程度的戰術
                    </div>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {window.innerWidth >= 640 ? '上升趨勢' : 'Increasing'}
                        </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{increasingTrends}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-600 hidden sm:block">
                        顯示上升趨勢的戰術
                    </div>
                </div>
            </div>

            {/* 響應式圖表 */}
            <div className="h-[200px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    {window.innerWidth >= 640 ? (
                        <LineChart
                            data={timePoints}
                            margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                                angle={-35}
                                textAnchor="end"
                                height={60}
                                tickMargin={20}
                                stroke="#9CA3AF"
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                                width={35}
                                stroke="#9CA3AF"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                            {chartData.datas.map((series) => (
                                <Line
                                    key={series.name}
                                    type="monotone"
                                    dataKey={series.name}
                                    stroke={getSeriesColor(series.name)}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                        strokeWidth: 0,
                                        fill: getSeriesColor(series.name)
                                    }}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <BarChart
                            data={recentTimePoints}
                            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10 }}
                                angle={-35}
                                textAnchor="end"
                                height={50}
                            />
                            <YAxis
                                tick={{ fontSize: 10 }}
                                width={25}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {chartData.datas.map((series) => (
                                <Bar
                                    key={series.name}
                                    dataKey={series.name}
                                    fill={getSeriesColor(series.name)}
                                    name={series.name}
                                />
                            ))}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* 移動端圖例 */}
            <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                {chartData.datas.map((series) => (
                    <div
                        key={series.name}
                        className="flex items-center gap-2 p-2 rounded-lg"
                        style={{ backgroundColor: `${getSeriesColor(series.name)}10` }}
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getSeriesColor(series.name) }}
                        />
                        <span className="text-xs text-gray-600 truncate">{series.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TtpLineChart;
