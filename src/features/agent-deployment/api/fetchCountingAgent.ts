import { avocadoClient } from '@/features/api/AvocadoClient';
import { FetchCountingAgentResponse } from "../types";

export const fetchNextAgentName = async (): Promise<FetchCountingAgentResponse> => {
    try {
        const response = await avocadoClient.get('/api/manage/next-agent-name');

        return {
            success: true,
            next_agent_name: response.next_agent_name  // response is already response.data from axios
        };
    } catch (error: any) {
        console.error("Error fetching next agent name:", error);
        return {
            success: false,
            next_agent_name: "default_agent_name"
        };
    }
}
