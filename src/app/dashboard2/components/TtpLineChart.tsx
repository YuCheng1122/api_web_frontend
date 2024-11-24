'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TtpLinechart } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: TtpLinechart;
}

const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
];

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

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">TTP Distribution Over Time</h2>
            <div className="h-[400px]"> {/* 增加圖表高度 */}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={timePoints}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 70  // 增加底部邊距
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                            tick={{
                                fontSize: 12,
                                fill: '#666',  // 更清晰的文字顏色
                            }}
                            angle={-35}  // 調整角度
                            textAnchor="end"
                            height={70}  // 增加高度
                            tickMargin={30}  // 增加文字與軸的距離
                        />
                        <YAxis
                            tick={{
                                fontSize: 12,
                                fill: '#666'
                            }}
                            width={45}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '8px'
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                        />
                        {chartData.datas.map((series, index) => (
                            <Line
                                key={series.name}
                                type="monotone"
                                dataKey={series.name}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}  // 增加線條寬度
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0 }}  // 改進活動點的樣式
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-6 text-sm text-gray-500 text-center"> {/* 增加上邊距 */}
                {chartData.label[0]?.label || 'TTP Distribution Trend'}
            </div>
        </div>
    );
}
