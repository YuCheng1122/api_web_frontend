import { avocadoClient } from '@/core/https/AvocadoClient';
import { FetchMitreDataResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchMitreData = async ({ id }: FetchAgentInfoParams): Promise<FetchMitreDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    
    try {
        const response = await avocadoClient.get('/api/agent_detail/agent_mitre', {
            params: {
                agent_name: id,
                start_time: endtime.toISOString(),
                end_time: nowtime.toISOString()
            }
        });

        const apiData = response.mitre_data;  // response is already response.data from axios

        // 只回傳 name 和 count
        const data = apiData.map((item: any) => ({
            name: item.mitre_tactic,
            count: item.mitre_count
        }));

        return {
            success: true,
            content: data
        };

    } catch (error: any) {
        console.error('Error fetching mitre data:', error);
        return {
            success: false,
            content: []
        };
    }
};
