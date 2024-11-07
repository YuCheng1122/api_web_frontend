import axios from "axios";
import Cookies from 'js-cookie';

export interface FetchCountingAgentResponse {
    success: boolean;
    next_agent_name: string;
}

const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/manage/next-agent-name`;

export const fetchNextAgentName = async (): Promise<FetchCountingAgentResponse> => {
    try {
        const header = {
            'Authorization': Cookies.get('token')
        };

        const response = await axios.get(api_url, {
            headers: header
        });

        return {
            success: true,
            next_agent_name: response.data.next_agent_name
        };

    } catch (error: any) {
        console.error("Error fetching next agent name:", error);
        return {
            success: false,
            next_agent_name: "default_agent_name"
        };
    }
}
