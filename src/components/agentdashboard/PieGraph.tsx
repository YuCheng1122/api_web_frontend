'use client'

// third-party
import ReactECharts from "echarts-for-react";

// utils
import { fetchPieDataType } from '@/utils/dashboard/fetchPieGaphData1'


const PieGraph = ({ title, data }: { title: string, data: fetchPieDataType[] }) => {
  const processedData = data.map(item => ({
    ...item,
    name: item.name.length > 5 ? item.name.substring(9, 14) : item.name
  }));


  const option = {
    title: {
      text: title,
      left: 'center',
      top: 'top',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      width: 100, // Limit width to control overflow
      height: 200, // Adjust height if necessary
      textStyle: {
        fontSize: 12,
        overflow: 'truncate' // Truncate overflowing text
      },
      tooltip: {
        show: true // Enable tooltip on legend items to show full text on hover
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'], // Adjusted inner and outer radius for better appearance
        avoidLabelOverlap: true,
        label: {
          show: false, // Hide labels on the pie slices for a cleaner look
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10
        },
        data: processedData
      }
    ]
  };


  return (

    <div className=" sm:max-w-[200px] sm:max-h-[300px] md:max-w-[500px] md:max-h-[400px] xl:max-w-[500px] 2xl:max-w-[600px]  w-full  flex flex-col p-2 bg-white rounded-lg shadow-lg min-h-48">
      <div className="text-sm font-bold">
        {title}
      </div>
      <div className="flex-grow">
        <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  )
}

export default PieGraph;
