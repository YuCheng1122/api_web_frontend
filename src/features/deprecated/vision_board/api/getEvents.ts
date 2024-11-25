'use client'

import { EventTableRequest, ApiResponse, EventTableData } from '../types';
import { makeDashboardRequest, ENDPOINTS } from './client';

interface EventTableResponse {
    content: {
        event_table: Array<{
            timestamp: string;
            agent_name: string;
            rule_description: string;
            rule_mitre_tactic: string;
            rule_mitre_id: string;
            rule_level: number;
        }>;
    };
}

export const getEvents = async (params: EventTableRequest): Promise<ApiResponse<EventTableData>> => {
    try {
        const response = await makeDashboardRequest<EventTableResponse>(
            ENDPOINTS.EVENT_TABLE,
            params.start,
            params.end
        );

        // Transform the data to match our EventTableRow structure
        const transformedData = {
            datas: response.content.event_table.map(item => ({
                timestamp: item.timestamp,
                agent_name: item.agent_name,
                rule_description: item.rule_description,
                rule_mitre_tactic: item.rule_mitre_tactic,
                rule_mitre_id: item.rule_mitre_id,
                rule_level: item.rule_level
            }))
        };

        return {
            success: true,
            content: transformedData
        };
    } catch (error) {
        console.error('Error fetching event table data:', error);
        return {
            success: false,
            content: {
                datas: []
            }
        };
    }
};
