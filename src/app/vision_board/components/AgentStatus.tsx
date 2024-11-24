'use client'

import { useState, useEffect } from 'react';
import { getAgentStatus } from '@/features/vision_board/api/getAgentStatus';
import PieGraph from './PieGraph';
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import ErrorDisplayer from '@/app/vision_board/components/Error';
import { AgentStatusChartData } from '@/features/vision_board/types';
import { formatAgentStatus } from '@/features/vision_board/utils/formatAgentStatus';

export default function AgentStatus() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<AgentStatusChartData>({ agent_summary: [] });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData({ agent_summary: [] });
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getAgentStatus({
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
                setError('Failed to fetch agent status data 😢. Please try again later.');
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

    // Format agent status data
    const formattedData = chartData.agent_summary.map(item => ({
        name: formatAgentStatus(item.name, item.value),
        value: item.value
    }));

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {chartData.agent_summary.length <= 0 ? (
                <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col">
                    <p className='text-2xl font-bold'>場域設備連線數</p>
                    <p>尚未有設備連線</p>
                </div>
            ) : (
                <PieGraph
                    title="場域設備連線情形"
                    data={formattedData}
                />
            )}
        </>
    );
}
