'use client'

import ReactECharts from "echarts-for-react";

interface PieDataType {
    name: string;
    value: number;
}

interface PieGraphProps {
    title: string;
    data: PieDataType[];
}

const PieGraph = ({ title, data }: PieGraphProps) => {
    const processedData = data.map(item => ({
        ...item,
        name: item.name.length > 5 ? item.name.substring(9, 14) : item.name
    }));

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
            right: 10,
            top: 'center',
            width: 100,
            height: 200,
            textStyle: {
                fontSize: 12,
                overflow: 'truncate'
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
                    show: false,
                    position: 'center'
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
                data: processedData
            }
        ]
    };

    return (
        <div className="sm:max-w-[200px] sm:max-h-[300px] md:max-w-[500px] md:max-h-[400px] xl:max-w-[500px] 2xl:max-w-[600px] w-full flex flex-col p-2 bg-white rounded-lg shadow-lg min-h-48">
            <div className="text-sm font-bold">
                {title}
            </div>
            <div className="flex-grow">
                <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    )
}

export default PieGraph;
