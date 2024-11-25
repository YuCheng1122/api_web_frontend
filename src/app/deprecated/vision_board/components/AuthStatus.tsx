'use client'

import { useState, useEffect } from 'react';
import { getAuthStatus } from '@/features/vision_board/api/getAuthStatus';
import PieGraph from './PieGraph';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import ErrorDisplayer from '@/app/deprecated/vision_board/components/Error';
import { AuthenticationChartData } from '@/features/vision_board/types';

export default function AuthStatus() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<AuthenticationChartData>({
        authentication_piechart: []
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({ authentication_piechart: [] });
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getAuthStatus({
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (response.success) {
                        // Select top 5 data
                        const data = response.content.authentication_piechart;
                        const top5Data = data.slice(0, 5);
                        setChartData({ authentication_piechart: top5Data });
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch authentication data 😢. Please try again later.');
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
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {chartData.authentication_piechart.length <= 0 ? (
                <div className="min-h-48 w-full bg-white rounded shadow-md flex justify-center items-center flex-col">
                    <p className='text-2xl font-bold'>身份驗證分析</p>
                    <p>目前尚未有不合法驗證</p>
                </div>
            ) : (
                <PieGraph
                    title="身份驗證分析"
                    data={chartData.authentication_piechart}
                />
            )}
        </>
    );
}
