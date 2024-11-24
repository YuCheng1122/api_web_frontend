'use client'

import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { getEventTrend, initData } from '@/features/vision_board/api/getEventTrend';
import Loading from '@/app/vision_board/components/Loading';
import ErrorDisplayer from '@/app/vision_board/components/Error';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import { EventTrendData } from '@/features/vision_board/types';

export default function EventTrend() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<EventTrendData>(initData);
    const [error, setError] = useState<string | null>(null);

    const option = {
        title: {
            text: '事件趨勢',
            textStyle: {
                fontSize: '14px'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            type: 'scroll',
            data: chartData.label.slice(0, 5),
            right: 10,  // 設置右邊距
            top: 30,    // 設置頂部邊距
            orient: 'vertical',
            align: 'right',  // 圖例文本右對齊
            textStyle: {
                fontSize: 10
            },
            pageButtonPosition: 'end',
            formatter: (name: string) => {
                // 限制圖例文本長度
                return name.length > 15 ? name.slice(0, 15) + '...' : name;
            }
        },
        grid: {
            left: '5%',
            right: '20%',  // 為圖例留出更多空間
            top: '15%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (value: number) => {
                    const date = new Date(value);
                    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '數量',
            splitNumber: 5,
            axisLabel: {
                margin: 15,
                fontSize: 12
            },
            min: 0,
            max: 'dataMax',
            minInterval: 1
        },
        series: chartData.datas.slice(0, 5)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const result = await getEventTrend({
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (result.success) {
                        setChartData(result.content);
                    } else {
                        throw new Error('Error fetching event trend data');
                    }
                }
            } catch (error) {
                console.error(error);
                setError('無法獲取趨勢數據 😢。請稍後再試。');
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

    return (
        <div className='h-full w-full min-h-[400px] bg-white rounded-md pt-10'>
            {isLoading ? (
                <Loading />
            ) : (
                <div className=''>
                    <ReactECharts option={option} />
                </div>
            )}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
        </div>
    );
}
