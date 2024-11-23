// third-party
import { useState, useEffect } from 'react'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext'
import ErrorDisplayer from '@/components/Error'

// utils
import { initData, EntirePieDataType, fetchPieGraphData } from '@/features/vision_dashboard/visiondashboard/fetchAgentsummaryPiegraphData'
import PieGraph from '@/app/visionboard/components/PieGraph'
import { slice } from 'lodash'


export default function AgentSummaryPie() {
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


    //   字串處理 不要後面五個字
    const sliceword = (word: string, value: number) => {

        // slice 的結果轉回字串
        const newword = word.slice(0, -7)
        return newword + " " + value
    }
    // change agent_summary name to splice the data agent
    const agent_summary = chartData.agent_summary.map((item) => {
        return { name: sliceword(item.name, item.value), value: item.value }
    }
    )

    return (
        <>
            {
                isLoading && <div>Loading...</div>
            }
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {
                chartData.agent_summary.length <= 0 ? <div className="w-full bg-white rounded shadow-md flex justify-center items-center flex-col"><p className=' text-2xl font-bold'>場域設備連線數</p> <p>尚未有設備連線</p></div> : <PieGraph title="場域設備連線情形" data={agent_summary} />

            }

        </>
    )
}