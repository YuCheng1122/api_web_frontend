"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import React, { useState, useEffect } from 'react';
import { getAgentDistribution } from '@/features/vision_board/api/getAgentDistribution';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/vision_board/components/card";
import ErrorDisplayer from "@/app/vision_board/components/Error";
import { AgentNameChartData } from "@/features/vision_board/types";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/app/vision_board/components/chart";

export default function AgentDistribution() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<AgentNameChartData>({ agent_name: [] });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({ agent_name: [] });
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getAgentDistribution({
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (response.success) {
                        setChartData(response.content as AgentNameChartData);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                }
            } catch (error) {
                setError('Failed to fetch agent distribution data 😢. Please try again later.');
                setTimeout(() => {
                    setError(null);
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };
        setIsLoading(true);
        fetchData();
    }, [dateTimeRange]);

    const chartConfig = {
        value: {
            label: "value",
            color: "#4CAF50", // Green bar color for a modern look
        },
        name: {
            color: "#333333", // Dark gray for labels
        },
    } satisfies ChartConfig;

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {chartData.agent_name.length <= 0 ? (
                <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col h-96">
                    <p className='text-2xl font-bold'>場域設備事件數量</p>
                    <p>未發生何事件</p>
                </div>
            ) : (
                <Card className="h-full w-full min-h-96 flex justify-center min-w-80 flex-col">
                    <CardHeader>
                        <CardTitle>場域設備事件數量</CardTitle>
                        <CardDescription>發生次數</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                accessibilityLayer
                                data={chartData.agent_name}
                                layout="vertical"
                                margin={{
                                    right: 16,
                                }}
                            >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    tickFormatter={(value) => value.slice(0, 3) + '...'}
                                    axisLine={false}
                                />
                                <XAxis dataKey="value" type="number" />
                                <ChartTooltip
                                    cursor={{ fill: '#f0f0f0' }}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#4CAF50"
                                    radius={4}
                                >
                                    <LabelList
                                        dataKey="name"
                                        position="insideLeft"
                                        offset={8}
                                        style={{ fill: '#ffffff', fontWeight: 'bold' }}
                                        fontSize={12}
                                    />
                                    <LabelList
                                        dataKey="value"
                                        position="right"
                                        offset={8}
                                        style={{ fill: '#000000', fontWeight: 'bold' }}
                                        fontSize={12}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
