import axios from 'axios';
import Cookies from 'js-cookie';
export interface AgentDetailType {
    agent_name: string;
    agent_id: string;
    ip: string;
    os: string;
    os_version: string;
    agent_status: string;
    last_keep_alive: string;
}
export interface fetchAgentDetailsResponse {
    success: boolean;
    content: AgentDetailType[];
}
type Props = {
    id: string;
};

export const fetchAgentDetails = async (props: Props): Promise<fetchAgentDetailsResponse> => {

    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agent_detail/agent-info?agent_name=${props.id}`;
    try {
        const header = {
            'Authorization': Cookies.get('token'),
        };
        console.log('header:', header);

        const response = await axios.get(api_url, {
            headers: header
        });
        const apiData = response.data.content;
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
}
