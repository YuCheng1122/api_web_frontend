'use client'

// third-party
import ReactECharts from "echarts-for-react";

// utils
import { fetchPieDataType } from '@/utils/dashboard/fetchPieGaphData1'


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

    <div className="h-full mx-2  min-w-80 flex flex-col p-2 bg-white rounded-lg shadow-lg min-h-80">
      <div className="text-sm font-bold">
        {title}
      </div>
      <div className="flex-grow mt-10">
        <ReactECharts option={option} className="h-full w-full" />
      </div>
    </div>
  )
}

export default PieGraph;
