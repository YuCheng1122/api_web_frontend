'use client'

import { TimeRangeRequest, ApiResponse, AuthenticationChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AuthenticationResponse {
    content: {
        authentication_piechart: Array<{
            count: number;
            tactic: string;
        }>;
    };
}

export const getAuthStatus = async (params: TimeRangeRequest): Promise<ApiResponse<AuthenticationChartData>> => {
    try {
        const response = await makeDashboardRequest<AuthenticationResponse>(
            ENDPOINTS.AUTHENTICATION,
            params.start,
            params.end
        );

        // Transform the data to match our ChartDataPoint structure
        const transformedData = {
            authentication_piechart: response.content.authentication_piechart.map(item => ({
                value: item.count,
                name: item.tactic,
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching authentication status data:', error);
        return {
            success: false,
            content: {
                authentication_piechart: []
            }
        };
    }
};
