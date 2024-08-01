'use client'

import ReactECharts from "echarts-for-react";

const PieGraph = ({title="Top 5 agents", data=[]}) => {
  const option = {
    title: {
      text: '網路流量來源',
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
        name: '流量來源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '搜尋引擎' },
          { value: 735, name: '直接訪問' },
          { value: 580, name: '電子郵件' },
          { value: 484, name: '社交媒體' },
          { value: 300, name: '廣告' }
        ],
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
    <div className="flex flex-col p-2 bg-white rounded-lg shadow-lg">
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
