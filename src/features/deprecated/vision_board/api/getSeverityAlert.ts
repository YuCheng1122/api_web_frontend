'use client'

import { TimeRangeRequest, ApiResponse, SeverityAlertData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface AlertsResponse {
    content: {
        alerts: {
            critical_severity: number;
            high_severity: number;
            medium_severity: number;
            low_severity: number;
        };
    };
}

export const initData: SeverityAlertData = {
    critical_severity: 0,
    high_severity: 0,
    medium_severity: 0,
    low_severity: 0
};

export const getSeverityAlert = async (params: TimeRangeRequest): Promise<ApiResponse<SeverityAlertData>> => {
    try {
        const response = await makeDashboardRequest<AlertsResponse>(
            ENDPOINTS.ALERTS,
            params.start,
            params.end
        );

        // 確保 alerts 數據存在
        if (!response.content?.alerts) {
            throw new Error('Invalid response format');
        }

        return {
            success: true,
            content: response.content.alerts
        };
    } catch (error) {
        console.error('Error fetching severity alert data:', error);
        return {
            success: false,
            content: initData
        };
    }
};
