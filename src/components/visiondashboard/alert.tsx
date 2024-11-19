import React from "react";

import { useState, useEffect } from 'react'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'
import ErrorDisplayer from '@/components/Error'

// utils
import { initData, EntireDataType, fetchAlertData } from '@/utils/visiondashboard/fetchAlertData'



type AlertProps = {
    critical_severity: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
};

const AlertComponent: React.FC<AlertProps> = ({ critical_severity, high_severity, medium_severity, low_severity }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full  ">
            <h2 className="text-right text-gray-500 text-xs font-semibold mb-4">LAST 24 HOURS ALERTS</h2>
            <div className="grid grid-cols-4 gap-6 text-center">

                <AlertCard label="最嚴重" value={critical_severity} color="text-red-500" rule="需要馬上改善" />
                <AlertCard label="高嚴重" value={high_severity} color="text-yellow-500" rule="警惕嚴防設備安全" />
                <AlertCard label="中嚴重" value={medium_severity} color="text-blue-500" rule="要求改善" />
                <AlertCard label="低嚴重" value={low_severity} color="text-teal-500" rule="警訊" />

            </div>
        </div>
    );
};

type AlertCardProps = {
    label: string;
    value: number;
    color: string;
    rule: string;
};

const AlertCard: React.FC<AlertCardProps> = ({ label, value, color, rule }) => {
    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">{label}</h3>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-600 mt-2">{rule}</p>
        </div>
    );
};

// Usage example
export default function App() {
    const { dateTimeRange } = useVisionBoardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<EntireDataType>(initData)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const fetchData = async () => {
            try {
                setChartData(initData)
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await fetchAlertData({ start: dateTimeRange.start, end: dateTimeRange.end })
                    if (response.success) {
                        setChartData(response.content)
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
    console.log(chartData);



    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}

            <AlertComponent critical_severity={chartData.critical_severity} high_severity={chartData.high_severity} medium_severity={chartData.medium_severity} low_severity={chartData.low_severity} />
        </>
    );
}
