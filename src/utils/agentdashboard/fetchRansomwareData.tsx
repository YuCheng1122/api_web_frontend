import axios from 'axios';
import Cookies from 'js-cookie';

type RansomwareData = {
    ransomware_data: {
        ransomware_name: string[];
        ransomware_count: number;
    };
};

export interface fetchRansomwareDataResponse {
    success: boolean;
    content: RansomwareData[];
}
type Props = {
    id: string;
};

export const fetchRansomwareData = async (props: Props): Promise<fetchRansomwareDataResponse> => {
    const nowtime = new Date();
    const endtime = new Date(nowtime);
    endtime.setDate(nowtime.getDate() - 1);
    // 時間格式為 "2024-10-05T00:00:00Z"
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent_ransomware?agent_name=${props.id}&start_time=${endtime.toISOString()}&end_time=${nowtime.toISOString()}`;
    console.log(api_url);

    try {
        const header = {
            'Authorization': Cookies.get('token'),
        };
        const response = await axios.get(api_url, {
            headers: header
        });

        const apiData = response.data.ransomware_data

        console.log(apiData);


        // 只回傳 name 和 count

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