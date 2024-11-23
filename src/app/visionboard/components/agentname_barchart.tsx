

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import React from "react";

import { useState, useEffect } from 'react'

import ErrorDisplayer from '@/components/Error' // Adjust the import path as necessary

// context
import { useVisionBoardContext } from '@/components/VisionBoardContext'

// utils
import { initData, EntirePieDataType, fetchPieGraphData } from '@/features/vision_dashboard/visiondashboard/fetchAgentnamePiegraphData'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"




export default function AgentnameBarChartComponent() {

    const { dateTimeRange } = useVisionBoardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<EntirePieDataType>(initData)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchData = async () => {
            try {
                setChartData(initData)
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await fetchPieGraphData({ start: dateTimeRange.start, end: dateTimeRange.end })
                    if (response.success) {

                        setChartData(response.content)
                    } else {
                        throw new Error('Failed to fetch data')
                    }
                }
            } catch (error) {
                setError('Failed to fetch pie graph data 😢. Please try again later.')
                setTimeout(() => {
                    setError(null)
                }, 3000)
            } finally {
                setIsLoading(false)
            }
        }
        setIsLoading(true)
        fetchData()
    }, [dateTimeRange])

    const chartConfig = {
        value: {
            label: "value",
            color: "#4CAF50", // Green bar color for a modern look
        },
        name: {
            color: "#333333", // Dark gray for labels
        },
    } satisfies ChartConfig





    return (
        <>
            {
                isLoading && <div>Loading...</div>
            }
            {
                error && <ErrorDisplayer errorMessage={error} setError={setError} />
            }
            {
                chartData.agent_name.length <= 0 ? <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col  h-96 "><p className=' text-2xl font-bold'>場域設備事件數量</p> <p>未發生何事件</p></div> :
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
                                        fill="#4CAF50" // Applying a fixed color for the bars
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


            }
        </>
    )
}
