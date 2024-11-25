'use client'

import { TimeRangeRequest, ApiResponse, EventTrendData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';
import { normalizeData } from '../utils/normalize';

interface TTPLineChartResponse {
    content: {
        tactic_linechart: [{
            label: Array<{ label: string }>;
            datas: Array<{
                name: string;
                type: string;
                data: Array<{
                    time: string;
                    value: number;
                }>;
            }>;
        }];
    };
}

export const initData: EventTrendData = {
    label: [],
    datas: []
};

export const getEventTrend = async (params: TimeRangeRequest): Promise<ApiResponse<EventTrendData>> => {
    try {
        const response = await makeDashboardRequest<TTPLineChartResponse>(
            ENDPOINTS.TTP_LINECHART,
            params.start,
            params.end
        );

        // 確保 tactic_linechart 存在且有數據
        if (!response.content?.tactic_linechart?.[0]) {
            throw new Error('Invalid response format');
        }

        const apiData = response.content.tactic_linechart[0];

        // Transform and normalize the data
        const transformedData: EventTrendData = {
            label: apiData.label.map(item => item.label),
            datas: apiData.datas.map(dataset => {
                const values = dataset.data.map(point => point.value);
                const normalizedValues = normalizeData(values);

                return {
                    name: dataset.name,
                    type: dataset.type,
                    data: dataset.data.map((point, index) => [
                        point.time,
                        normalizedValues[index]
                    ] as [string, number])
                };
            })
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching event trend data:', error);
        return {
            success: false,
            content: initData
        };
    }
};
