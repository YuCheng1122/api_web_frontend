'use client'

import { TimeRangeRequest, ApiResponse, AgentOSChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AgentOSResponse {
    content: {
        agent_os: Array<{
            count: number;
            os: string;
        }>;
    };
}

export const getOSDistribution = async (params: TimeRangeRequest): Promise<ApiResponse<AgentOSChartData>> => {
    try {
        const response = await makeDashboardRequest<AgentOSResponse>(
            ENDPOINTS.AGENT_OS,
            params.start,
            params.end
        );

        // Transform the data to match our ChartDataPoint structure
        const transformedData = {
            agent_os: response.content.agent_os.map(item => ({
                value: item.count,
                name: item.os,
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching OS distribution data:', error);
        return {
            success: false,
            content: {
                agent_os: []
            }
        };
    }
};
