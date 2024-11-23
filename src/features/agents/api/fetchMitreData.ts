import axios from 'axios';
import Cookies from 'js-cookie';
import { FetchMitreDataResponse, FetchAgentInfoParams } from '../types/agent';

export const fetchMitreData = async ({ id }: FetchAgentInfoParams): Promise<FetchMitreDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent_mitre`;

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

        const apiData = response.data.mitre_data;

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
}
