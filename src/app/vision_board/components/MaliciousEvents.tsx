'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import React, { useState, useEffect } from 'react';
import { getMaliciousFiles } from '@/features/vision_board/api/getMaliciousFiles';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/ui/chart";
import ErrorDisplayer from "@/app/ui/Error";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/ui/card";
import { MaliciousFilesChartData } from '@/features/vision_board/types';

export default function MaliciousEvents() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<MaliciousFilesChartData>({
        malicious_file_barchart: []
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({ malicious_file_barchart: [] });
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getMaliciousFiles({
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (response.success) {
                        setChartData(response.content);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch malicious files data 😢. Please try again later.');
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
        count: {
            label: "count",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
        },
    } satisfies ChartConfig;

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {chartData.malicious_file_barchart.length <= 0 ? (
                <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col h-96">
                    <p className='text-2xl font-bold'>惡意檔案分析</p>
                    <p>目前未檢測到任何威脅</p>
                </div>
            ) : (
                <Card className="h-full md:min-w-[600px]">
                    <CardHeader>
                        <CardTitle>惡意檔案分析</CardTitle>
                        <CardDescription>檔案 數量</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <BarChart
                                accessibilityLayer
                                data={chartData.malicious_file_barchart}
                                layout="vertical"
                                margin={{
                                    right: 16,
                                }}
                            >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                    dataKey="malicious_file"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    hide
                                />
                                <XAxis dataKey="count" type="number" hide />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Bar
                                    dataKey="count"
                                    layout="vertical"
                                    fill="var(--color-count)"
                                    radius={4}
                                >
                                    <LabelList
                                        dataKey="malicious_file"
                                        position="insideLeft"
                                        offset={8}
                                        className="fill-[--color-label]"
                                        fontSize={12}
                                    />
                                    <LabelList
                                        dataKey="count"
                                        position="right"
                                        offset={8}
                                        className="fill-foreground"
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
