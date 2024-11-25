'use client'

import { TimeRangeRequest, ApiResponse, CVEChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface CVEResponse {
    content: {
        cve_barchart: Array<{
            cve_name: string;
            count: number;
        }>;
    };
}

export const getCVEDistribution = async (params: TimeRangeRequest): Promise<ApiResponse<CVEChartData>> => {
    try {
        const response = await makeDashboardRequest<CVEResponse>(
            ENDPOINTS.CVE_BARCHART,
            params.start,
            params.end
        );

        // Transform the data to match our CVEDataPoint structure
        const transformedData = {
            cve_barchart: response.content.cve_barchart.map(item => ({
                cve_name: item.cve_name,
                count: item.count
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching CVE distribution data:', error);
        return {
            success: false,
            content: {
                cve_barchart: []
            }
        };
    }
};
