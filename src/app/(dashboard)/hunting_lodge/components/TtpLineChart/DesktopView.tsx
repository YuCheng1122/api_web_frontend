'use client';

import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import type { ViewProps } from './types';
import { CustomTooltip } from './components/CustomTooltip';

export const DesktopView: FC<ViewProps> = ({
    timePoints,
    chartData,
    criticalCount,
    increasingTrends,
    getSeriesColor
}) => {
    return (
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
};
