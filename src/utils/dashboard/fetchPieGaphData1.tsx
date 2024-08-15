import axios from 'axios'
import Cookies from 'js-cookie'

export interface fetchPieDataType {
  value: number;
  name: string;  
}

export type EntirePieDataType = {
  top_agents: fetchPieDataType[]
  top_event_counts: fetchPieDataType[]
  top_events: fetchPieDataType[]
  top_mitre: fetchPieDataType[]
}

export interface fetchPieGraphDataRequest {
  start: Date
  end: Date
}

export interface fetchPieGraphDataResponse {
  success: boolean
  content: EntirePieDataType
}

export const initData: EntirePieDataType = {
  top_agents: [],
  top_event_counts: [],
  top_events: [],
  top_mitre: []
}



export const fetchPieGraphData = async (param: fetchPieGraphDataRequest): Promise<fetchPieGraphDataResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wazuh/pie-chart`;
  
  try {
    const header = {
      'Authorization': Cookies.get('token')
    }
    
    const response = await axios.get(api_url, {
      params: {
        start_time: param.start.toISOString(),
        end_time: param.end.toISOString(),
      },
      headers: header        
    });

    const apiData = response.data.content;
    console.log('apiData:', apiData);

    // Assuming the API returns data in a format similar to the mock data
    // You may need to adjust this based on the actual API response structure

    return {
      success: true,
      content: apiData
    }

  } catch (error: any) {
    console.error('Error fetching pie graph data:', error);
    return {
      success: false,
      content: {
        top_agents: [],
        top_event_counts: [],
        top_events: [],
        top_mitre: []
      }
    };
  }
}
