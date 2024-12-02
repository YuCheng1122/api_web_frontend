export interface AgentOS {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    agent_os: AgentO[];
}

export interface AgentO {
    os:    string;
    count: number;
}
