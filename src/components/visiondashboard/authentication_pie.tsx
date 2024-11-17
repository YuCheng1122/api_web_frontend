// third-party
import { useState, useEffect } from 'react'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'
import ErrorDisplayer from '@/components/Error'

// utils
import { initData, EntirePieDataType, fetchPieGraphData } from '@/utils/visiondashboard/fetchAuthenticationpiechartData'
import PieGraph from '@/components/visiondashboard/PieGraph'

export default function AgentAuthenticationPie() {
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


    return (
        <>
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            <PieGraph title="Agent Summary" data={chartData.authentication_piechart} />
        </>
    )
}