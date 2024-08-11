export interface fetchEventTrendDataType {
  label: string[]  
  datas: {
    name: string
    type: string
    data: Array<[string, number]> 
  }[]
}

export interface fetchEventTrendDataRequest {
  start: Date
  end: Date
}

export interface fetchEventTrendDataResponse {
  success: boolean
  content: fetchEventTrendDataType
}

export const initData: fetchEventTrendDataType = {
  label: [],  
  datas: []
}

export const fetchEventTrendData = async (param: fetchEventTrendDataRequest): Promise<fetchEventTrendDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: fetchEventTrendDataType = {
        label: ['test1', 'test2', 'test3', 'test4'], 
        datas: [
          {
            name: 'test1',
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
            name: 'test2',
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
            name: 'test3',
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
            name: 'test4',
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

      const response: fetchEventTrendDataResponse = {
        success: true,
        content: result
      }

      resolve(response)
    }, 2500)
  })
}
