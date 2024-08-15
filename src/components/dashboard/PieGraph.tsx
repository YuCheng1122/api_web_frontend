'use client'

// third-party
import {useState, useEffect} from 'react'
import ReactECharts from "echarts-for-react";

// context
import {useDashBoardContext} from '@/contexts/DashBoardContext'

// utils
import {fetchPieDataType} from '@/utils/dashboard/fetchPieGaphData1'


// components
import ErrorDisplayer from '@/components/Error'


const PieGraph = ({ title, data }: { title: string, data: fetchPieDataType[] }) => {


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
        data: data,
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


  return (
    
    <div className="h-full w-full relative flex flex-col p-2 bg-white rounded-lg shadow-lg">
      {/* {error && <ErrorDisplayer errorMessage={error} setError={setError} /> } */}
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
