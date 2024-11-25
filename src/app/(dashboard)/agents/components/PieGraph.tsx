'use client'

import ReactECharts from "echarts-for-react";
import { useEffect, useState } from 'react';

interface PieDataType {
    name: string;
    value: number;
}

interface PieGraphProps {
    title: string;
    data: PieDataType[];
}

const PieGraph = ({ title, data }: PieGraphProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const processedData = data.map(item => ({
        ...item,
        name: item.name.length > 20 ? `${item.name.substring(0, 17)}...` : item.name
    }));

    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const originalItem = data.find(item => item.value === params.value);
                return `${originalItem?.name || params.name}: ${params.value}`;
            }
        },
        legend: {
            orient: isMobile ? 'horizontal' : 'vertical',
            right: isMobile ? 'center' : 10,
            top: isMobile ? 'bottom' : 'center',
            width: isMobile ? '90%' : 150,
            height: isMobile ? 'auto' : 200,
            type: 'scroll',
            textStyle: {
                fontSize: 12,
                overflow: 'truncate'
            },
            tooltip: {
                show: true,
                formatter: (params: any) => {
                    const originalItem = data.find(item =>
                        item.name.includes(params.name)
                    );
                    return originalItem?.name || params.name;
                }
            },
            pageTextStyle: {
                color: '#666'
            }
        },
        series: [
            {
                type: 'pie',
                radius: isMobile ? ['35%', '55%'] : ['40%', '60%'],
                center: isMobile ? ['50%', '40%'] : ['40%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: processedData
            }
        ]
    };

    return (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>

            {/* Chart */}
            <div className={`p-4 ${isMobile ? 'h-[300px]' : 'h-[400px]'}`}>
                {data.length > 0 ? (
                    <ReactECharts
                        option={option}
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'svg' }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PieGraph;
