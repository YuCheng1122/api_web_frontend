import { avocadoClient } from '@/core/https/AvocadoClient';
import { FetchRansomwareDataResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchRansomwareData = async ({ id }: FetchAgentInfoParams): Promise<FetchRansomwareDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    
    try {
        const response = await avocadoClient.get('/api/agent_detail/agent_ransomware', {
            params: {
                agent_name: id,
                start_time: endtime.toISOString(),
                end_time: nowtime.toISOString()
            }
        });

        const apiData = response.ransomware_data;  // response is already response.data from axios
        return {
            success: true,
            content: apiData
        };

    } catch (error: any) {
        console.error('Error fetching ransomware data:', error);
        return {
            success: false,
            content: []
        };
    }
};
