import { avocadoClient } from '@/features/api/AvocadoClient';
import { FetchAgentDetailsResponse } from '../types/agent';

export const fetchAgentDetails = async (): Promise<FetchAgentDetailsResponse> => {
    try {
        const response = await avocadoClient.get('/api/wazuh/agent-details');
        const apiData = response.content;
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
};
