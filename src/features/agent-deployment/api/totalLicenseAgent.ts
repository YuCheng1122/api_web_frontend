import { avocadoClient } from '@/features/api/AvocadoClient';
import { TotalAgentsAndLicenseResponse } from '../types';

export const getTotalAgentsAndLicense = async (): Promise<TotalAgentsAndLicenseResponse> => {
    try {
        const response = await avocadoClient.get('/api/manage/total-agents-and-license');

        return {
            total_agents: response.total_agents,  // response is already response.data from axios
            total_license: response.total_license
        };
    } catch (error: any) {
        console.error('Error during fetching total agents and license:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch total agents and license');
    }
};
