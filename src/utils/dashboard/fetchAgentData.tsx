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
    const result: AgentDataType[] = apiData.agents

    return {
      success: true,
      content: result
    };

  } catch (error: any) {
    console.error('Error fetching agent data:', error);
    return {
      success: false,
      content: initData
    };
  }
}