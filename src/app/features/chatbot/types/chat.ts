// Chat related type definitions
export interface Message {
    text: string;
    isUser: boolean;
    timestamp?: Date;
}

export interface DashboardInfo {
    totalAgents: number;
    activeAgents: number;
    topAgent: string;
    topEvent: string;
    topMitre: string;
    totalEvents: number;
    latestEventTrends: Array<{ name: string; value: number }>;
    recentEvents: Array<{
        time: string;
        agent_name: string;
        rule_description: string;
        rule_mitre_tactic: string;
        rule_mitre_id: string;
        rule_level: number;
    }>;
    agentDistribution: {
        windows: { total: number; active: number };
        linux: { total: number; active: number };
        macos: { total: number; active: number };
    };
}

export interface ChatError {
    message: string;
    code: string;
    details?: unknown;
}

export interface StreamResponse {
    type: 'content_block_delta';
    delta: {
        type: 'text_delta';
        text: string;
    };
}
