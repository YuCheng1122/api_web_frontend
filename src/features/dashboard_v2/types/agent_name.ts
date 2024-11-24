export interface AgentName {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    agent_name: AgentNameElement[];
}

export interface AgentNameElement {
    agent_name:  string;
    event_count: number;
}
