'use client'

// third party imports
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react';
import { ToastContainer, toast } from 'react-toastify';

// component
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import DateTimeFilter from '@/components/graph/DateTimeFilter'
// utils
import { initData,fetchGraphData } from '@/utils/graph/fetchGraphData'


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

  const formatTooltip = (params: any) => {
    if (params.dataType === 'node') {
      return `<strong>${params.data.id}</strong><br/>IP: ${params.data.name || 'No info'}`;
    } else {
      return `<strong>Edge</strong><br/>Source: ${params.data.source || 'No info'}<br/>Target: ${params.data.target || 'No info'}`;
    }
  };

  const option = {
    title: {
      text: 'Threat Graph',
      subtext: 'AIXIOR',
      top: '10',
      left: 'center',
      textStyle: {
        fontSize: 32,
        fontWeight: 'bold'
      },
      subtextStyle: {
        fontSize: 12
      }

    },
    tooltip: {
      trigger: 'item',
      formatter: formatTooltip
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      name: 'Graph',
      type: 'graph',
      layout: 'force',
      data: graphData.nodes,
      links: graphData.edges,
      roam: true,
      force: {
        repulsion: 10000,
        edgeLength: [100, 200],
        gravity: 0.1,
        layoutAnimation: true,
        friction: 0.6
      }
    }],
    dataZoom: [{
      type: 'inside',
      zoomOnMouseWheel: true,
      zoomLock: false,
      throttle: 100
    }]
  };


  return (
    <>
      <div className='h-full w-full grid grid-rows-[auto,1fr] gap-2 p-2'>

        {/* datetime filter */}
        <div className='p-2 bg-gray-100 rounded-lg'>
          <DateTimeFilter handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} handleSubmit={handleSubmit} />
        </div>

        {/* graph display */}
        <div className='bg-gray-100 rounded-lg p-4'>
          {isLoading ? 
            <Loading /> 
            : 
            <ReactECharts 
              option={option} 
              theme={'dark'} 
              style={{ height: '100%', width: '100%', opacity: '0.8', borderRadius: '10px',overflow: 'hidden'}} 
            />
          }
        </div>

      </div>
      <ToastContainer />
    </>
    
  )
};

export default GraphPage
