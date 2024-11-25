'use client'

import { TimeRangeRequest, ApiResponse, AgentStatusChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AgentSummaryResponse {
    content: {
        agent_summary: Record<string, number>;
    };
}

export const getAgentStatus = async (params: TimeRangeRequest): Promise<ApiResponse<AgentStatusChartData>> => {
    try {
        const response = await makeDashboardRequest<AgentSummaryResponse>(
            ENDPOINTS.AGENT_SUMMARY,
            params.start,
            params.end
        );

        // Transform the object data to array format for ChartDataPoint
        const transformedData = {
            agent_summary: Object.entries(response.content.agent_summary).map(([key, value]) => ({
                name: key,
                value: value,
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching agent status data:', error);
        return {
            success: false,
            content: {
                agent_summary: []
            }
        };
    }
};
