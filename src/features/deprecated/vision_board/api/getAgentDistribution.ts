'use client'

import { TimeRangeRequest, ApiResponse, AgentNameChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AgentNameResponse {
    content: {
        agent_name: Array<{
            event_count: number;
            agent_name: string;
        }>;
    };
}

export const getAgentDistribution = async (params: TimeRangeRequest): Promise<ApiResponse<AgentNameChartData>> => {
    try {
        const response = await makeDashboardRequest<AgentNameResponse>(
            ENDPOINTS.AGENT_NAME,
            params.start,
            params.end
        );

        // Transform the data to match our ChartDataPoint structure
        const transformedData = {
            agent_name: response.content.agent_name.map(item => ({
                value: item.event_count,
                name: item.agent_name,
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching agent distribution data:', error);
        return {
            success: false,
            content: {
                agent_name: []
            }
        };
    }
};
