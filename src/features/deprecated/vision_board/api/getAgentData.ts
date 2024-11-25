'use client'

import { TimeRangeRequest, ApiResponse, AgentData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AgentDataResponse {
    content: AgentData[];
}

export const getAgentData = async (params: TimeRangeRequest): Promise<ApiResponse<AgentData[]>> => {
    try {
        const response = await makeDashboardRequest<AgentDataResponse>(
            ENDPOINTS.AGENT_DATA,
            params.start,
            params.end
        );

        return {
            success: true,
            content: response.content
        };
    } catch (error) {
        console.error('Error fetching agent data:', error);
        return {
            success: false,
            content: []
        };
    }
};
