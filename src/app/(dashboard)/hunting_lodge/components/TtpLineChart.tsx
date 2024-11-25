'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import type { TtpLinechart, TtpLinechartTypes } from '@/features/dashboard_v2/types';

interface Props {
    data: TtpLinechart;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

interface TimePoint {
    time: string;
    [key: string]: string | number;
}

// New color palette for different TTP types
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
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 max-w-[280px] sm:max-w-none">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{new Date(label || '').toLocaleString()}</p>
            <div className="space-y-1 sm:space-y-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                style={{ backgroundColor: TTP_COLORS[entry.name] || '#6B7280' }}
                            />
                            <span className="text-xs sm:text-sm text-gray-700">{entry.name}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium" style={{ color: TTP_COLORS[entry.name] || '#6B7280' }}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function TtpLineChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const chartData = data.content.tactic_linechart[0];

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    if (!chartData) return null;

    // Transform data for Recharts
    const timePoints: TimePoint[] = chartData.datas[0]?.data.map((point: TtpLinechartTypes.Datum) => ({
        time: new Date(point.time).toLocaleString(),
        ...chartData.datas.reduce((acc: Record<string, number>, series: TtpLinechartTypes.Data) => ({
            ...acc,
            [series.name]: series.data.find((d: TtpLinechartTypes.Datum) => d.time === point.time)?.value || 0
        }), {} as Record<string, number>)
    })) || [];

    // Get color for a series
    const getSeriesColor = (seriesName: string) => TTP_COLORS[seriesName] || '#6B7280';

    // Calculate trend summary
    const calculateTrendSummary = () => {
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

    const { criticalCount, increasingTrends } = calculateTrendSummary();

    // Mobile view
    const MobileView = () => {
        // Get last 5 time points
        const recentTimePoints = timePoints.slice(-5);

        return (
            <div className="space-y-4">
                {/* Trend summary cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-medium text-gray-700">Critical</span>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{criticalCount}</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700">Increasing</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">{increasingTrends}</div>
                    </div>
                </div>

                {/* Simplified chart */}
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                            {chartData.datas.map((series: TtpLinechartTypes.Data) => (
                                <Bar
                                    key={series.name}
                                    dataKey={series.name}
                                    fill={getSeriesColor(series.name)}
                                    name={series.name}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                    {chartData.datas.map((series: TtpLinechartTypes.Data) => (
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

    // Desktop view
    const DesktopView = () => (
        <div className="space-y-6">
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
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
                        {chartData.datas.map((series: TtpLinechartTypes.Data) => (
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
                </ResponsiveContainer>
            </div>

            {/* Trend summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Critical Tactics</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{criticalCount}</div>
                    <div className="mt-2 text-sm text-orange-600">
                        Tactics with critical severity
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Increasing Trends</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{increasingTrends}</div>
                    <div className="mt-2 text-sm text-blue-600">
                        Tactics showing upward trend
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">TTP Distribution Over Time</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
