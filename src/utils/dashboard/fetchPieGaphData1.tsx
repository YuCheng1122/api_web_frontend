export interface fetchPieDataType {
  value: number;
  name: string;  
}

export interface fetchPieGraphDataRequest {
  dataType: string  // 根據dataType 呼叫對應的 API
  start: Date
  end: Date
}

export interface fetchPieGraphDataResponse {
  success: boolean
  content: fetchPieDataType[]
}

export const initData = []


export const fetchPieGraphData = async (param: fetchPieGraphDataRequest): Promise<fetchPieGraphDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {

      const result =  [
        { value: 1048, name: '搜尋引擎' },
        { value: 735, name: '直接訪問' },
        { value: 580, name: '電子郵件' },
        { value: 484, name: '社交媒體' },
        { value: 300, name: '廣告' }
      ]
    

      const response = {
        success: true,
        content: result
      }

      resolve(response)

    }, 2500)
  })

}

