'use client'

// third-party
import {useState, useEffect} from 'react'
import ReactECharts from "echarts-for-react";

// context
import {useDashBoardContext} from '@/contexts/DashBoardContext'

// utils
import {initData, fetchPieDataType, fetchPieGraphData} from '@/utils/dashboard/fetchPieGaphData1'


// components
import ErrorDisplayer from '@/components/Error'


const PieGraph = ({ title }: { title: string }) => {

  const {dateTimeRange} = useDashBoardContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chartData, setChartData] = useState<fetchPieDataType[]>(initData)
  const [error, setError] = useState<string | null>(null)

  const option = {
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }; 

  useEffect(() => {
    if(isLoading) return
    setIsLoading(true)
    const fetchData = async () => {
      try{
        setChartData(initData)
        if(dateTimeRange?.start && dateTimeRange?.end){
          const response = await fetchPieGraphData({dataType: title, start: dateTimeRange.start, end: dateTimeRange.end})
          if(response.success){
            setChartData(response.content)
          }else{
            throw new Error('Failed to fetch data')
          }          
        }
      }catch(error){
        console.log(error)
        setError(`Failed to fetch ${title} data 😢. Please try again later.`)
        setTimeout(() => {
          setError(null)
        }, 3000)
      }finally{
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dateTimeRange])

  return (
    
    <div className="h-full w-full relative flex flex-col p-2 bg-white rounded-lg shadow-lg">
      {error && <ErrorDisplayer errorMessage={error} setError={setError} /> }
      <div className="text-sm font-bold">
        {title}
      </div>
      <div className="flex-grow">
        <ReactECharts option={option} style={{width: "100%", height: "100%"}} />        
      </div>
    </div>
  )
}

export default PieGraph;
