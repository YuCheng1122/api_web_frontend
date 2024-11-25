// Common Types
export interface AgentData {
    agent_name: string;
    ip: string;
    os: string;
    agent_status: string;
    last_keep_alive: string;
    registration_time: string;
}

export type DateTimeRange = {
    start: Date | null;
    end: Date | null;
}

// Chart Data Types
export interface ChartDataPoint {
    value: number;
    name: string;
}

export interface CVEDataPoint {
    cve_name: string;
    count: number;
}

export interface MaliciousFileDataPoint {
    malicious_file: string;
    count: number;
}

export interface EventTableRow {
    timestamp: string;
    agent_name: string;
    rule_description: string;
    rule_mitre_tactic: string;
    rule_mitre_id: string;
    rule_level: number;
    time?: string;
}

export interface EventTrendDataset {
    name: string;
    type: string;
    data: Array<[string, number]>;
}

export interface SeverityAlertData {
    critical_severity: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
}

// Chart Data Interfaces
export interface AgentNameChartData {
    agent_name: ChartDataPoint[];
}

export interface AgentOSChartData {
    agent_os: ChartDataPoint[];
}

export interface AgentStatusChartData {
    agent_summary: ChartDataPoint[];
}

export interface AuthenticationChartData {
    authentication_piechart: ChartDataPoint[];
}

export interface CVEChartData {
    cve_barchart: CVEDataPoint[];
}

export interface MaliciousFilesChartData {
    malicious_file_barchart: MaliciousFileDataPoint[];
}

export interface EventTableData {
    datas: EventTableRow[];
}

export interface EventTrendData {
    label: string[];
    datas: EventTrendDataset[];
}

// Generic Chart Data type
export type ChartData = 
    | AgentNameChartData 
    | AgentOSChartData 
    | AgentStatusChartData
    | AuthenticationChartData
    | CVEChartData
    | EventTableData
    | EventTrendData
    | MaliciousFilesChartData
    | SeverityAlertData;

// API Request/Response Types
export interface TimeRangeRequest {
    start: Date;
    end: Date;
}

export interface EventTableRequest extends TimeRangeRequest {
    id: number;
}

export interface ApiResponse<T> {
    success: boolean;
    content: T;
}

// Context Types
export type VisionBoardContextType = {
    dateTimeRange: DateTimeRange;
    changeDateTimeRange: (start: Date, end: Date) => void;
    agentData: AgentData[];
    updateAgentData: (newData: AgentData[]) => void;
}
