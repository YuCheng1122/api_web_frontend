'use client'
import Table from '../../components/visiondashboard/table'
import PieGraph from '@/components/agentdashboard/PieGraph'
import BarChartComponent from '@/components/visiondashboard/bar'
import EventTrendGraph from '@/components/visiondashboard/EventTrendGraph'
import AlertComponent from '@/components/visiondashboard/alert'
import DateTimeFilter from '@/components/visiondashboard/DateTimeFilter'
// third-party
import { useState, useEffect } from 'react'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'
import ErrorDisplayer from '@/components/Error'

// utils
import { initData, EntirePieDataType, fetchPieGraphData } from '@/utils/visiondashboard/fetchPiegraphData'

export default function Visionboardpage() {
    // pie graph data
    const { dateTimeRange } = useVisionBoardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<EntirePieDataType>(initData)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        if (isLoading) return
        setIsLoading(true)
        const fetchData = async () => {
            try {
                setChartData(initData)
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await fetchPieGraphData({ start: dateTimeRange.start, end: dateTimeRange.end })
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
    console.log(chartData);




    return (
        <>
            <div className='h-full p-3 bg-gray-100 rounded-lg '>
                <div className="h-full w-full flex flex-wrap  ">
                    <div className="flex flex-col gap-2 w-full h-1/2">
                        <DateTimeFilter />
                    </div>
                    <div className='flex flex-col gap-2 xl:w-2/5  h-full w-full p-5 '>
                        {error && <ErrorDisplayer errorMessage={error} setError={setError} />}

                        <div className='flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center h-full max-h-96 mb-5'>
                            <PieGraph title="Vulnerability" data={chartData.agent_name} />
                            <PieGraph title="Vulnerability" data={chartData.agent_name} />
                        </div>
                        <div className="w-full h-full flex items-center justify-center"> {/* Set fixed height */}
                            <BarChartComponent />
                        </div>

                        <div className="flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center min-h-48">
                            <Table />
                        </div>
                        {/* <div className="flex md:flex-row sm:flex-row  flex-col gap-2  w-full justify-center min-h-48">
                            <BarChartComponent />
                        
                        </div> */}
                    </div>

                    <div className="flex  w-full xl:w-3/5  min-h-96 h-1/2 flex-col">
                        <AlertComponent />
                        <EventTrendGraph />

                        <div className='flex md:flex-row sm:flex-row  flex-col   w-full  justify-center min-h-96 gap-2 '>
                            <PieGraph title="Vulnerability" data={chartData.agent_name} />
                            <PieGraph title="Vulnerability" data={chartData.agent_name} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}