export interface AgentSummary {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    agent_summary: AgentSummaryClass;
}

export interface AgentSummaryClass {
    connected_agents:    number;
    disconnected_agents: number;
}
