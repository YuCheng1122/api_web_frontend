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
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      data: chartData.label.slice(0, 5),
      right: 10,  // 設置右邊距
      top: 30,    // 設置頂部邊距
      orient: 'vertical',
      align: 'right',  // 圖例文本右對齊
      textStyle: {
        fontSize: 10
      },
      pageButtonPosition: 'end',
      formatter: (name) => {
        // 限制圖例文本長度
        return name.length > 15 ? name.slice(0, 15) + '...' : name;
      }
    },
    grid: {
      left: '5%',
      right: '20%',  // 為圖例留出更多空間
      top: '15%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
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
        margin: 16,
        fontSize: 12
      },
      min: 0,
      max: 'dataMax',
      minInterval: 1
    },
    series: chartData.datas.slice(0, 5)
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
