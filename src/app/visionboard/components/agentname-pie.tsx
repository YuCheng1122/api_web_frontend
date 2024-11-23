// third-party
import { useState, useEffect } from 'react'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'
import ErrorDisplayer from '@/components/Error'

// utils
import { initData, EntirePieDataType, fetchPieGraphData } from '@/features/vision_dashboard/visiondashboard/fetchAgentnamePiegraphData'
import PieGraph from '@/app/visionboard/components/PieGraph'

export default function AgentNamePie() {
    // pie graph data
    const { dateTimeRange } = useVisionBoardContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [chartData, setChartData] = useState<EntirePieDataType>(initData)
    const [error, setError] = useState<string | null>(null)



    useEffect(() => {

        const fetchData = async () => {
            try {
                setChartData(initData)
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const response = await fetchPieGraphData({ start: dateTimeRange.start, end: dateTimeRange.end })
                    if (response.success) {
                        // select data top 5
                        const data = response.content.agent_name
                        const top5Data = data.slice(0, 5)
                        setChartData({ agent_name: top5Data })

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




    return (
        <>
            {
                isLoading && <div>Loading...</div>
            }
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {
                chartData.agent_name.length <= 0 ? <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col"><p className=' text-2xl font-bold'>場域設備事件數量</p> <p>未發生何事件</p></div> : <PieGraph title="場域設備事件數量" data={chartData.agent_name} />
            }
        </>
    )
}