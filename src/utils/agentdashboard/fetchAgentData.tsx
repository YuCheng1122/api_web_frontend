import axios from 'axios'
import Cookies from 'js-cookie'

export interface AgentDataType {
  id: number
  agent_name: string
  data: number | null
}

export interface fetchAgentDataRequest {
  start: Date
  end: Date
}

export interface fetchAgentDataResponse {
  success: boolean
  content: AgentDataType[]
  error?: string
}

export const initData: AgentDataType[] = [
  { id: 1, agent_name: "Active agents", data: null },
  { id: 2, agent_name: "Total agents", data: null },
  { id: 3, agent_name: "Active Windows agents", data: null },
  { id: 4, agent_name: "Windows agents", data: null },
  { id: 5, agent_name: "Active Linux agents", data: null },
  { id: 6, agent_name: "Linux agents", data: null },
  { id: 7, agent_name: "Active MacOS agents", data: null },
  { id: 8, agent_name: "MacOs agents", data: null },
]

export const fetchAgentData = async (param: fetchAgentDataRequest): Promise<fetchAgentDataResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wazuh/agents/summary`;
  
  try {
    console.log('Fetching agent data with params:', {
      start_time: param.start.toISOString(),
      end_time: param.end.toISOString()
    });

    const token = Cookies.get('token');
    if (!token) {
      console.error('No auth token found');
      return {
        success: false,
        content: initData,
        error: 'No authentication token found'
      };
    }

    const header = {
      'Authorization': token
    }
    
    const response = await axios.get(api_url, {
      params: {
        start_time: param.start.toISOString(),
        end_time: param.end.toISOString()
      },
      headers: header        
    });

    const apiData = response.data;
    console.log('Agent API response:', apiData);

    if (!apiData || !apiData.agents) {
      console.error('Invalid API response format:', apiData);
      return {
        success: false,
        content: initData,
        error: 'Invalid API response format'
      };
    }

    const result: AgentDataType[] = apiData.agents;

    if (!Array.isArray(result)) {
      console.error('API response is not an array:', result);
      return {
        success: false,
        content: initData,
        error: 'API response is not in the expected format'
      };
    }

    return {
      success: true,
      content: result
    };

  } catch (error: any) {
    console.error('Error fetching agent data:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    let errorMessage = 'Failed to fetch agent data';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `Server error: ${error.response.status} - ${error.response.data?.detail || error.message}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }

    return {
      success: false,
      content: initData,
      error: errorMessage
    };
  }
}
