'use client'

import ReactECharts from "echarts-for-react";
import { ChartDataPoint } from "@/features/vision_board/types";

interface PieGraphProps {
    title: string;
    data: ChartDataPoint[];
}

const PieGraph = ({ title, data }: PieGraphProps) => {
    const option = {
        title: {
            text: title,
            left: 'center',
            top: 'top',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            right: 0,
            top: 'bottom',
            width: 100,
            height: 60,
            textStyle: {
                fontSize: 10,
                overflow: 'truncate',
            },
            tooltip: {
                show: true
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {c} ',
                    fontSize: 12
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                data: data
            }
        ]
    };

    return (
        <div className="sm:max-w-[200px] sm:max-h-[300px] md:max-w-[500px] md:max-h-[400px] xl:max-w-[500px] 2xl:max-w-[600px] w-full flex flex-col p-2 bg-white rounded-lg shadow-lg min-h-48">
            <div className="flex-grow">
                <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
};

export default PieGraph;
