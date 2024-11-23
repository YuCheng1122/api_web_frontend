import axios from 'axios';
import Cookies from 'js-cookie';
import { AgentDetailType, FetchAgentDetailsResponse } from '../types/agent';

export const fetchAgentDetails = async (): Promise<FetchAgentDetailsResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wazuh/agent-details`;

  try {
    const header = {
      'Authorization': Cookies.get('token')
    };

    const response = await axios.get(api_url, {
      headers: header
    });

    const apiData = response.data.content;
    console.log('apiData:', apiData);

    return {
      success: true,
      content: apiData
    };

  } catch (error: any) {
    console.error('Error fetching agent details:', error);
    return {
      success: false,
      content: []
    };
  }
}
