'use client';

import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { ViewProps } from './types';
import { CustomTooltip } from './components/CustomTooltip';

export const MobileView: FC<ViewProps> = ({
    timePoints,
    chartData,
    criticalCount,
    increasingTrends,
    getSeriesColor
}) => {
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
                        {chartData.datas.map((series) => (
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
