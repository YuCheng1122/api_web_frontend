

"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import React from "react";

import { useState, useEffect } from 'react'

import ErrorDisplayer from '@/components/Error' // Adjust the import path as necessary

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'

// utils
import { initData, EntireDataType, fetchCVEBarData } from '@/features/vision_dashboard/visiondashboard/fetchCVEBarData'

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




export default function CVEBarChartComponent() {

    const { dateTimeRange } = useVisionBoardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<EntireDataType[]>(initData)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchData = async () => {
            try {
                setChartData(initData)
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await fetchCVEBarData({ start: dateTimeRange.start, end: dateTimeRange.end })
                    if (response.success) {
                        // slice only 5 data
                        setChartData(response.content.slice(0, 5))


                    } else {
                        throw new Error('Failed to fetch data')
                    }
                }
            } catch (error) {
                console.log(error)
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
        count: {
            label: "count",
            color: "hsl(var(--chart-1))",
        },
        label: {
            color: "hsl(var(--background))",
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
                chartData.length <= 0 ? <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col h-96 "><p className=' text-2xl font-bold'>CVE分析</p> <p>目前沒有發現CVE漏洞</p></div> :
                    <Card className="h-full md:min-w-[600px]">
                        <CardHeader>
                            <CardTitle>CVE分析</CardTitle>
                            <CardDescription>攻擊次數</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    layout="vertical"
                                    margin={{
                                        right: 16,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                        dataKey="cve_name"
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
                                            dataKey="cve_name"
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


            }
        </>
    )
}
