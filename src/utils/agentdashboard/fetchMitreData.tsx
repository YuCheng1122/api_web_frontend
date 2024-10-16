import axios from 'axios';
import Cookies from 'js-cookie';

type MitreData = {
    mitre_tactic: string;
    mitre_technique: string;
    mitre_count: number;
    mitre_ids: string[];
    rule_description: string;
};
export interface fetchMitreDataResponse {
    success: boolean;
    content: MitreData[];
}
type Props = {
    id: string;
};
export const fetchMitreData = async (props: Props): Promise<fetchMitreDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    // 時間格式為 "2024-10-05T00:00:00Z"
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent_mitre?agent_name=${props.id}&start_time=${endtime.toISOString()}&end_time=${nowtime.toISOString()}`;


    try {
        const header = {
            'Authorization': Cookies.get('token'),
        };
        const response = await axios.get(api_url, {
            headers: header
        });

        const apiData = response.data.mitre_data

        // 只回傳 name 和 count
        const data = apiData.map((item: any) => {
            return {
                name: item.mitre_tactic,
                count: item.mitre_count
            };
        }
        );
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