'use client'

import React, { useState, useEffect } from 'react';
import { getSeverityAlert, initData } from '@/features/deprecated/vision_board/api/getSeverityAlert';
import { useVisionBoardContext } from '@/features/deprecated/vision_board/contexts/VisionBoardContext';
import ErrorDisplayer from '@/app/deprecated/vision_board/components/Error';
import { SeverityAlertData } from '@/features/deprecated/vision_board/types';

interface AlertCardProps {
    label: string;
    value: number;
    color: string;
    rule: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ label, value, color, rule }) => {
    return (
        <div className="p-4 bg-gray-100 rounded-lg min-h-48 flex items-center flex-col justify-center gap-3">
            <h3 className="text-lg font-semibold">{label}</h3>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-600 mt-2">{rule}</p>
        </div>
    );
};

interface AlertComponentProps extends SeverityAlertData { }

const AlertComponent: React.FC<AlertComponentProps> = ({
    critical_severity,
    high_severity,
    medium_severity,
    low_severity
}) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <div className="grid grid-cols-4 gap-6 text-center">
                <AlertCard
                    label="嚴重風險事件"
                    value={critical_severity}
                    color="text-red-500"
                    rule="需要馬上改善"
                />
                <AlertCard
                    label="高風險事件"
                    value={high_severity}
                    color="text-yellow-500"
                    rule="警惕嚴防設備安全"
                />
                <AlertCard
                    label="中風險事件"
                    value={medium_severity}
                    color="text-blue-500"
                    rule="要求改善"
                />
                <AlertCard
                    label="低風險事件"
                    value={low_severity}
                    color="text-teal-500"
                    rule="警訊"
                />
            </div>
        </div>
    );
};

export default function SeverityAlert() {
    const { dateTimeRange } = useVisionBoardContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<SeverityAlertData>(initData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setChartData(initData);
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await getSeverityAlert({
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
                setError('Failed to fetch severity alert data 😢. Please try again later.');
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
            <AlertComponent
                critical_severity={chartData.critical_severity}
                high_severity={chartData.high_severity}
                medium_severity={chartData.medium_severity}
                low_severity={chartData.low_severity}
            />
        </>
    );
}
