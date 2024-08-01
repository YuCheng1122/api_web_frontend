'use client'

import ReactECharts from 'echarts-for-react';

const EventTrendGraph = () => {
  // 呼叫 API
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
      data: ['Interface entered i', 'Windows application', 'Maximum authenticati', 'Possible kernel level r', 'User account changed'],
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
    series: [
      {
        name: 'Interface entered i',
        type: 'line',
        data: [
          ['2024-07-24 00:00', 0],
          ['2024-07-26 00:01', 5],
          ['2024-07-28 00:02', 6],
          ['2024-07-30 00:03', 1],
          ['2024-08-01 00:04', 2]
        ]
      },
      {
        name: 'Windows application',
        type: 'line',
        data: [
          ['2024-07-24 00:00', 1],
          ['2024-07-26 00:01', 4],
          ['2024-07-28 00:02', 6],
          ['2024-07-30 00:03', 2],
          ['2024-08-01 00:04', 2]
        ]
      },
      {
        name: 'Maximum authenticati',
        type: 'line',
        data: [
          ['2024-07-24 00:00', 5],
          ['2024-07-26 00:01', 5],
          ['2024-07-28 00:02', 8],
          ['2024-07-30 00:03', 10],
          ['2024-08-01 00:04', 2]
        ]
      },
      {
        name: 'Possible kernel level r',
        type: 'line',
        data: [
          ['2024-07-24 00:00', 3],
          ['2024-07-26 00:01', 1],
          ['2024-07-28 00:02', 2],
          ['2024-07-30 00:03', 0],
          ['2024-08-01 00:04', 0]
        ]
      },
    ]
  }

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}

export default EventTrendGraph;
