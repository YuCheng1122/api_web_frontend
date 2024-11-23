import axios from 'axios';
import Cookies from 'js-cookie';
import { FetchAgentDashboardResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchAgentInfo = async ({ id }: FetchAgentInfoParams): Promise<FetchAgentDashboardResponse> => {
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent-info`;
    
    try {
        const header = {
            'Authorization': Cookies.get('token'),
        };

        const response = await axios.get(api_url, {
            headers: header,
            params: {
                agent_name: id
            }
        });
        
        return {
            success: true,
            content: response.data.content
        };
    } catch (error: any) {
        console.error('Error fetching agent info:', error);
        return {
            success: false,
            content: {
                agent_id: '',
                agent_name: '',
                ip: '',
                os: '',
                os_version: '',
                agent_status: '',
                last_keep_alive: ''
            }
        };
    }
}
