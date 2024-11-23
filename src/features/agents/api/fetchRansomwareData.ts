import axios from 'axios';
import Cookies from 'js-cookie';
import { FetchRansomwareDataResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchRansomwareData = async ({ id }: FetchAgentInfoParams): Promise<FetchRansomwareDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent_ransomware`;

    try {
        const header = {
            'Authorization': Cookies.get('token'),
        };
        const response = await axios.get(api_url, {
            headers: header,
            params: {
                agent_name: id,
                start_time: endtime.toISOString(),
                end_time: nowtime.toISOString()
            }
        });

        const apiData = response.data.ransomware_data;
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
}
