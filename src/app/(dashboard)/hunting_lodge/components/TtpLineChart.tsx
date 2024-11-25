'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TtpLinechart } from '@/features/dashboard_v2/types';

interface Props {
    data: TtpLinechart;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const COLORS = {
    critical: '#DC2626', // red-600
    high: '#F97316',    // orange-500
    medium: '#F59E0B',  // amber-500
    low: '#10B981',     // emerald-500
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 max-w-[280px] sm:max-w-none">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{new Date(label || '').toLocaleString()}</p>
            <div className="space-y-1 sm:space-y-2">
                {payload.map((entry: any, index: number) => {
                    // Calculate color based on value
                    let color = COLORS.low;
                    const value = entry.value;
                    if (value >= 10) color = COLORS.critical;
                    else if (value >= 7) color = COLORS.high;
                    else if (value >= 4) color = COLORS.medium;

                    return (
                        <div key={index} className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <div
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-xs sm:text-sm text-gray-700">{entry.name}</span>
                            </div>
                            <span
                                className="text-xs sm:text-sm font-medium"
                                style={{ color }}
                            >
                                {value}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function TtpLineChart({ data }: Props) {
    const chartData = data.content.tactic_linechart[0];
    if (!chartData) return null;

    // Transform data for Recharts
    const timePoints = chartData.datas[0]?.data.map(point => ({
        time: new Date(point.time).toLocaleString(),
        ...chartData.datas.reduce((acc, series) => ({
            ...acc,
            [series.name]: series.data.find(d => d.time === point.time)?.value || 0
        }), {})
    })) || [];

    // Calculate max value for each series for color determination
    const seriesMaxValues = chartData.datas.reduce((acc, series) => ({
        ...acc,
        [series.name]: Math.max(...series.data.map(d => d.value))
    }), {} as Record<string, number>);

    // Get color for a series based on its maximum value
    const getSeriesColor = (seriesName: string) => {
        const maxValue = seriesMaxValues[seriesName] || 0;
        if (maxValue >= 10) return COLORS.critical;
        if (maxValue >= 7) return COLORS.high;
        if (maxValue >= 4) return COLORS.medium;
        return COLORS.low;
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">TTP Distribution Over Time</h2>
            <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={timePoints}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 0,
                            bottom: 60
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="time"
                            tick={{
                                fontSize: 10,
                                fill: '#6B7280',
                            }}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                            tickMargin={20}
                            stroke="#9CA3AF"
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{
                                fontSize: 10,
                                fill: '#6B7280'
                            }}
                            width={35}
                            stroke="#9CA3AF"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconSize={8}
                            wrapperStyle={{
                                fontSize: '12px'
                            }}
                            formatter={(value) => (
                                <span style={{ color: getSeriesColor(value) }}>
                                    {value}
                                </span>
                            )}
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
                </ResponsiveContainer>
            </div>
            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 text-center">
                {chartData.label[0]?.label || 'TTP Distribution Trend'}
            </div>
            <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs text-gray-400 text-center">
                Colors indicate severity: Red (Critical), Orange (High), Amber (Medium), Green (Low)
            </div>
        </div>
    );
}
