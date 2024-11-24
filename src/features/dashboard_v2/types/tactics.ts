export interface Tactics {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    agent_summary: AgentSummary;
}

export interface AgentSummary {
    connected_agents:    number;
    disconnected_agents: number;
}
