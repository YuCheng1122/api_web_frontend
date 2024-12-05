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
import type { TtpLinechart } from '../../../../../features/dashboard_v2/types';
import { transformDataForCharts, calculateTrendSummary, getSeriesColor } from './utils';
import { CustomTooltip } from './components/CustomTooltip';

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
