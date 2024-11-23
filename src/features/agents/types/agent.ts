export interface AgentDetailType {
  agent_name: string;
  ip: string;
  os: string;
  agent_status: number;
  last_keep_alive: string;
}

export interface AgentDashboardDetailType {
  agent_id: string;
  agent_name: string;
  ip: string;
  os: string;
  os_version: string;
  agent_status: string;
  last_keep_alive: string;
}

export interface MitreData {
  mitre_tactic: string;
  mitre_technique: string;
  mitre_count: number;
  mitre_ids: string[];
  rule_description: string;
}

export interface MitreDisplayData {
  name: string;
  count: number;
}

export interface RansomwareData {
  ransomware_data: {
    ransomware_name: string[];
    ransomware_count: number;
  };
}

export interface FetchAgentDetailsResponse {
  success: boolean;
  content: AgentDetailType[];
}

export interface FetchAgentDashboardResponse {
  success: boolean;
  content: AgentDashboardDetailType;
}

export interface FetchMitreDataResponse {
  success: boolean;
  content: MitreDisplayData[];
}

export interface FetchRansomwareDataResponse {
  success: boolean;
  content: RansomwareData[];
}

export interface FetchAgentInfoParams {
  id: string;
}
