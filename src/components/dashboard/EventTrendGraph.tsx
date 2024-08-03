'use client'

// third-party
import {useState, useEffect} from 'react'
import ReactECharts from 'echarts-for-react';

// components
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'

// context
import {useDashBoardContext} from '@/contexts/DashBoardContext'

// utils
import {initData, fetchEventTrendData, fetchEventTrendDataType} from '@/utils/dashboard/fetchEventTrendData'

const EventTrendGraph = () => {
  const {dateTimeRange} = useDashBoardContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chartData, setChartData] = useState<fetchEventTrendDataType>(initData)
  const [error, setError] = useState<string | null>(null)

  const option = {
    title: {
      text: '事件趨勢 (level 8~14)',
      textStyle: {
        fontSize: '14px'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: chartData.label,
      right: 'right',
      orient: 'vertical'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axiosLabel: {
        formatter: (value: number) => {
          const date = new Date(value);
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      splitNumber: 5,
      axisLabel: {
        margin: 16,  // 增加標籤與軸線之間的距離
        fontSize: 12  // 調整字體大小
      }
    },
    series: chartData.datas
  }

  useEffect(() => {
    const fetchData = async () => {
      if(isLoading) return
      setIsLoading(true)
      try{
        if(dateTimeRange?.start && dateTimeRange?.end){
          const result = await fetchEventTrendData({start: dateTimeRange?.start, end: dateTimeRange?.end})
          if(result.success){
            setChartData(result.content)
          }else{
            throw new Error("Error fetching event trend data")
          }
        }
      }catch(error){
        console.log(error)
        setError("Failed to fetch trend data 😢. Please try again later.")
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
    <div className='h-full w-full relative'>
      {error && <ErrorDisplayer errorMessage={error} setError={setError} /> }
      {isLoading ? <Loading /> : <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />}
    </div>
  )
}

export default EventTrendGraph;
