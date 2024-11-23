'use client'

import { useState, useEffect } from 'react';
import { getOSDistribution } from '@/features/vision_board/api/getOSDistribution';
import PieGraph from './PieGraph';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import ErrorDisplayer from '@/app/ui/Error';
import { AgentOSChartData } from '@/features/vision_board/types';

export default function OSDistribution() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<AgentOSChartData>({ agent_os: [] });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({ agent_os: [] });
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getOSDistribution({
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (response.success) {
                        // Select top 5 data
                        const data = response.content.agent_os;
                        const top5Data = data.slice(0, 5);
                        setChartData({ agent_os: top5Data });
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch OS distribution data 😢. Please try again later.');
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
            {chartData.agent_os.length <= 0 ? (
                <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col min-h-96">
                    <p className='text-2xl font-bold'>場域設備作業系統</p>
                    <p>目前沒有安裝設備</p>
                </div>
            ) : (
                <PieGraph
                    title="場域設備作業系統"
                    data={chartData.agent_os}
                />
            )}
        </>
    );
}
