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

// Enhanced color configuration
const TTP_COLORS: { [key: string]: { base: string; gradient: string } } = {
    'Initial Access': {
        base: 'hsl(210, 85%, 50%)',
        gradient: 'linear-gradient(45deg, hsl(210, 85%, 50%), hsl(220, 85%, 55%))'
    },
    'Execution': {
        base: 'hsl(0, 85%, 60%)',
        gradient: 'linear-gradient(45deg, hsl(0, 85%, 60%), hsl(10, 85%, 65%))'
    },
    'Persistence': {
        base: 'hsl(280, 70%, 45%)',
        gradient: 'linear-gradient(45deg, hsl(280, 70%, 45%), hsl(290, 70%, 50%))'
    },
    'Privilege Escalation': {
        base: 'hsl(25, 85%, 55%)',
        gradient: 'linear-gradient(45deg, hsl(25, 85%, 55%), hsl(35, 85%, 60%))'
    },
    'Defense Evasion': {
        base: 'hsl(150, 75%, 40%)',
        gradient: 'linear-gradient(45deg, hsl(150, 75%, 40%), hsl(160, 75%, 45%))'
    },
    'Credential Access': {
        base: 'hsl(45, 90%, 50%)',
        gradient: 'linear-gradient(45deg, hsl(45, 90%, 50%), hsl(55, 90%, 55%))'
    },
    'Discovery': {
        base: 'hsl(190, 85%, 50%)',
        gradient: 'linear-gradient(45deg, hsl(190, 85%, 50%), hsl(200, 85%, 55%))'
    },
    'Lateral Movement': {
        base: 'hsl(320, 75%, 50%)',
        gradient: 'linear-gradient(45deg, hsl(320, 75%, 50%), hsl(330, 75%, 55%))'
    },
    'Collection': {
        base: 'hsl(260, 70%, 45%)',
        gradient: 'linear-gradient(45deg, hsl(260, 70%, 45%), hsl(270, 70%, 50%))'
    },
    'Command and Control': {
        base: 'hsl(230, 70%, 45%)',
        gradient: 'linear-gradient(45deg, hsl(230, 70%, 45%), hsl(240, 70%, 50%))'
    },
    'Exfiltration': {
        base: 'hsl(350, 85%, 60%)',
        gradient: 'linear-gradient(45deg, hsl(350, 85%, 60%), hsl(0, 85%, 65%))'
    },
    'Impact': {
        base: 'hsl(170, 75%, 40%)',
        gradient: 'linear-gradient(45deg, hsl(170, 75%, 40%), hsl(180, 75%, 45%))'
    }
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
    TTP_COLORS[seriesName as keyof typeof TTP_COLORS]?.base || 'hsl(var(--muted-foreground))';

// CustomTooltip Component
const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-popover/95 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg border border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                {new Date(label || '').toLocaleString()}
            </p>
            <div className="space-y-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getSeriesColor(entry.name) }}
                            />
                            <span className="text-xs sm:text-sm text-popover-foreground">{entry.name}</span>
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

    const timePoints = transformDataForCharts(chartData);
    const recentTimePoints = timePoints.slice(-5);
    const { criticalCount, increasingTrends } = calculateTrendSummary(timePoints);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">MITRE 戰術時間分佈</h2>

            {/* 趨勢摘要卡片 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: TTP_COLORS['Execution'].base }} />
                        <span className="text-sm font-medium text-card-foreground">
                            {window.innerWidth >= 640 ? '嚴重戰術' : 'Critical'}
                        </span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: TTP_COLORS['Execution'].base }}>{criticalCount}</div>
                    <div className="mt-2 text-sm hidden sm:block" style={{ color: TTP_COLORS['Execution'].base }}>
                        具有嚴重程度的戰術
                    </div>
                </div>
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: TTP_COLORS['Initial Access'].base }} />
                        <span className="text-sm font-medium text-card-foreground">
                            {window.innerWidth >= 640 ? '上升趨勢' : 'Increasing'}
                        </span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: TTP_COLORS['Initial Access'].base }}>{increasingTrends}</div>
                    <div className="mt-2 text-sm hidden sm:block" style={{ color: TTP_COLORS['Initial Access'].base }}>
                        顯示上升趨勢的戰術
                    </div>
                </div>
            </div>

            {/* 圖表區域 */}
            <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg">
                <div className="h-[200px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {window.innerWidth >= 640 ? (
                            <LineChart
                                data={timePoints}
                                margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.5} />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    angle={-35}
                                    textAnchor="end"
                                    height={60}
                                    tickMargin={20}
                                    stroke="hsl(var(--muted-foreground))"
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    width={35}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
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
                                            r: 6,
                                            strokeWidth: 2,
                                            stroke: getSeriesColor(series.name),
                                            fill: 'hsl(var(--background))'
                                        }}
                                    />
                                ))}
                            </LineChart>
                        ) : (
                            <BarChart
                                data={recentTimePoints}
                                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    angle={-35}
                                    textAnchor="end"
                                    height={50}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                    width={25}
                                    stroke="hsl(var(--muted-foreground))"
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
            </div>

            {/* 移動端圖例 */}
            <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                {chartData.datas.map((series) => (
                    <div
                        key={series.name}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 backdrop-blur-sm hover:bg-accent/70 transition-colors"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getSeriesColor(series.name) }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{series.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TtpLineChart;
