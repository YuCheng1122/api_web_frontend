'use client'

import { TimeRangeRequest, ApiResponse, MaliciousFilesChartData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface MaliciousFileResponse {
    content: {
        malicious_file_barchart: Array<{
            malicious_file: string;
            count: number;
        }>;
    };
}

export const getMaliciousFiles = async (params: TimeRangeRequest): Promise<ApiResponse<MaliciousFilesChartData>> => {
    try {
        const response = await makeDashboardRequest<MaliciousFileResponse>(
            ENDPOINTS.MALICIOUS_FILE,
            params.start,
            params.end
        );

        // Transform the data to match our MaliciousFileDataPoint structure
        const transformedData = {
            malicious_file_barchart: response.content.malicious_file_barchart.map(item => ({
                malicious_file: item.malicious_file,
                count: item.count
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching malicious files data:', error);
        return {
            success: false,
            content: {
                malicious_file_barchart: []
            }
        };
    }
};
