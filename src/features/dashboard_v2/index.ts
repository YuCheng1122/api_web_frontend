export interface TimeRange {
    start_time: string;
    end_time: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface DashboardResponse {
    agent_summary: any;
    tactics: any;
    agent_os: any;
    alerts: any;
    cve_barchart: any;
    ttp_linechart: any;
    malicious_file: any;
    authentication: any;
    agent_name: any;
    event_table: any;
}

export interface AuthResponse {
    access_token: string;
}
