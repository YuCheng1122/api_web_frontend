import axios from 'axios';
import Cookies from 'js-cookie';
import { TotalAgentsAndLicenseResponse } from '../types';

export const getTotalAgentsAndLicense = async (): Promise<TotalAgentsAndLicenseResponse> => {
  const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manage/total-agents-and-license`;

  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': Cookies.get('token'),
        'Content-Type': 'application/json'
      }
    });

    return {
      total_agents: response.data.total_agents,
      total_license: response.data.total_license
    };

  } catch (error: any) {
    console.error('Error during fetching total agents and license:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch total agents and license');
  }
};
