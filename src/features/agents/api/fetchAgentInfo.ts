import { avocadoClient } from '@/core/https/AvocadoClient';
import { FetchAgentDashboardResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchAgentInfo = async ({ id }: FetchAgentInfoParams): Promise<FetchAgentDashboardResponse> => {
    try {
        const response = await avocadoClient.get('/api/agent_detail/agent-info', {
            params: {
                agent_name: id
            }
        });
        
        return {
            success: true,
            content: response.content
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
};
