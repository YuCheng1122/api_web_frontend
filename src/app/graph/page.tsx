'use client'

import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import DateTimeFilter from '@/app/graph/components/DateTimeFilter'
import { initData,fetchGraphData } from '@/features/graph/fetchGraphData'


interface GraphDataProps {
  nodes: any[];
  edges: any[];
}


const GraphPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [graphData, setGraphData] = useState<GraphDataProps>({ nodes: initData.content.nodes, edges: initData.content.edges })
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async() => {
    console.log(startDate, endDate)
    if (!startDate || !endDate) {
      toast.error('Please select date')
      return
    }

    if(startDate >= endDate){
      toast.error('Start date must be before end date')
      return
    }
        
    if(isLoading) return
    setIsLoading(true)
    try{
      // 後續要改成從cookie拿token
      const response = await fetchGraphData({ startDate: startDate, endDate: endDate, token: '' })
      if(response.success){
        console.log(response)
        setGraphData({nodes: response.content.nodes, edges: response.content.edges})
      }else{
        // throw new Error('Failed to fetch graph data') as ErrorType;
      }
    }catch(error){
      console.log(error);
      toast.error('Failed to fetch graph data 😢, please try again later')
    }finally{
      setIsLoading(false)
    }
  };


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value))
  }


  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value))
  }
  graphData.nodes.map(node => ({
    ...node,
    symbol: node.attributes?.tags?.includes('gateway')
        ? 'image://gateway-icon.png'
        : node.attributes?.tags?.includes('internal')
            ? 'image://internal-icon.png'
            : 'circle',  // 默認圖示
    symbolSize: 38, // 圖示大小
    label: {
      show: true, // 顯示標籤
      position: 'bottom', // 標籤顯示在圖示下方
      formatter: node.id, // 標籤的內容可以是節點的ID或其他屬性
      fontSize: 12, // 標籤字體大小
      color: '#000000' // 標籤字體顏色
    }
  }));
  graphData.edges.map(edge => ({
    ...edge,
    lineStyle: {
      normal: {
        color: '#000000',
        width: 2, // 線的寬度
        curveness: 0, // 線的曲率，0為直線
      }
    },
    symbol: ['none', 'arrow'], // 設置起點無箭頭，終點為箭頭
    symbolSize: 10, // 設置箭頭大小
  }));


  return (
      <>
      <div className='h-full w-full grid grid-rows-[auto,1fr] gap-2 p-2'>

        {/* datetime filter */}
        <div className='p-2 rounded-lg'>
          <DateTimeFilter handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} handleSubmit={handleSubmit} />
        </div>

        {/* message */}
        <div className="relative flex items-center justify-center h-[70vh] p-4 text-center">
          {/* 包裹 <p> 的內層 div */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-lg p-8">
            <p className="text-2xl font-bold">您尚未訂閱此項服務，請洽業務人員。</p>
          </div>
        </div>

      </div>
      <ToastContainer />
    </>
    
  )
};

export default GraphPage
