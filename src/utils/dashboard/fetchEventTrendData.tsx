import axios from 'axios'
import Cookies from 'js-cookie'

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
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wazuh/line-chart`;
  
  try {
    const header = {
      'Authorization': Cookies.get('token')
    }
    
    const response = await axios.get(api_url, {
      params: {
        start_time: param.start.toISOString(),
        end_time: param.end.toISOString()
      },
      headers: header        
    });

    const apiData = response.data;
    console.log('apiData:', apiData);

    // Assuming the API returns data in a format similar to the mock data
    // You may need to adjust this based on the actual API response structure
    const result: fetchEventTrendDataType = {
      label: apiData.label || [],
      datas: apiData.datas || []
    };

    return {
      success: true,
      content: result
    };

  } catch (error: any) {
    console.error('Error fetching event trend data:', error);
    return {
      success: false,
      content: initData
    };
  }
}