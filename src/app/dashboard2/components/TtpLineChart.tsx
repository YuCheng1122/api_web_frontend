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
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timePoints}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            width={40}
                        />
                        <Tooltip />
                        <Legend />
                        {chartData.datas.map((series, index) => (
                            <Line
                                key={series.name}
                                type="monotone"
                                dataKey={series.name}
                                stroke={COLORS[index % COLORS.length]}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
                {chartData.label[0]?.label || 'TTP Distribution Trend'}
            </div>
        </div>
    );
}
