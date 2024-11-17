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
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-right text-gray-500 text-xs font-semibold mb-4">LAST 24 HOURS ALERTS</h2>
            <div className="grid grid-cols-4 gap-6 text-center">
                <AlertCard label="Critical severity" value={critical_severity} color="text-red-500" rule="Rule level 15 or higher" />
                <AlertCard label="High severity" value={high_severity} color="text-yellow-500" rule="Rule level 12 to 14" />
                <AlertCard label="Medium severity" value={medium_severity} color="text-blue-500" rule="Rule level 7 to 11" />
                <AlertCard label="Low severity" value={low_severity} color="text-teal-500" rule="Rule level 0 to 6" />
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
        if (isLoading) return
        setIsLoading(true)
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
        fetchData()
    }, [dateTimeRange])




    return (
        <>
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
