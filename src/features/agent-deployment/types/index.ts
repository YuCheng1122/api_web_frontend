export interface FetchCountingAgentResponse {
    success: boolean;
    next_agent_name: string;
}

export interface TotalAgentsAndLicenseResponse {
    total_agents: number;
    total_license: number;
}

// 用於 API 錯誤處理
export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}
