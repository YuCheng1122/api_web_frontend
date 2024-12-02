export interface Type {
    agent_summary:  TacticsClass;
    tactics:        TacticsClass;
    agent_os:       AgentOS;
    alerts:         TypeAlerts;
    cve_barchart:   CveBarchart;
    ttp_linechart:  TtpLinechart;
    malicious_file: MaliciousFile;
    authentication: Authentication;
    agent_name:     TypeAgentName;
    event_table:    TypeEventTable;
}

export interface TypeAgentName {
    success: boolean;
    content: AgentNameContent;
    message: string;
}

export interface AgentNameContent {
    agent_name: AgentNameElement[];
}

export interface AgentNameElement {
    agent_name:  AgentNameEnum;
    event_count: number;
}

export enum AgentNameEnum {
    Ao108027 = "AO108027",
    Ao110006 = "AO110006",
    Ao113001 = "AO113001",
    Falcon36001 = "falcon36_001",
    Falcon36002 = "falcon36_002",
    Falcondrill001_LMVictim = "falcondrill_001_LM_victim",
    Falcondrill002_SMBVictim = "falcondrill_002_SMB_victim",
    Falcondrill003_RMPhishingVictim = "falcondrill_003_RM_Phishing_victim",
    Falconenv001_RMPhishingVictim = "falconenv_001_RM_Phishing_victim",
    Falconenv002_LMVictim = "falconenv_002_LM_victim",
    Falconenv004 = "falconenv_004",
    Falconenv005 = "falconenv_005",
    Falconenv007_0_SMBVictim = "falconenv_007_0_SMB_victim",
    Falconenv008_0_RMPhishingVictim = "falconenv_008_0_RM_Phishing_victim",
    HOOST002_Poc5 = "HOOST_002_poc5",
    HOOST003_Poc5 = "HOOST_003_poc5",
    HOOST004_Poc5 = "HOOST_004_poc5",
    HOOST005_Poc5 = "HOOST_005_poc5",
    HOOST007_Poc5 = "HOOST_007_poc5",
    HOOST008_Poc5 = "HOOST_008_poc5",
    Jack = "Jack",
    LMVictim = "LM_victim",
    Peterwowip002 = "peterwowip_002",
    Poc2001 = "poc2_001",
    RMPhishing = "RM_Phishing",
    Rain2001 = "Rain2_001",
    SMBVictim = "SMB_victim",
    Sam002 = "sam_002",
    Sam003 = "sam_003",
    VersatilePeter001 = "versatile_peter_001",
    Vm2Rm = "VM2_RM",
}

export interface AgentOS {
    success: boolean;
    content: AgentOSContent;
    message: string;
}

export interface AgentOSContent {
    agent_os: AgentO[];
}

export interface AgentO {
    os:    string;
    count: number;
}

export interface TacticsClass {
    success: boolean;
    content: AgentSummaryContent;
    message: string;
}

export interface AgentSummaryContent {
    agent_summary: ContentAgentSummary;
}

export interface ContentAgentSummary {
    connected_agents:    number;
    disconnected_agents: number;
}

export interface TypeAlerts {
    success: boolean;
    content: AlertsContent;
    message: string;
}

export interface AlertsContent {
    alerts: ContentAlerts;
}

export interface ContentAlerts {
    critical_severity: number;
    high_severity:     number;
    medium_severity:   number;
    low_severity:      number;
}

export interface Authentication {
    success: boolean;
    content: AuthenticationContent;
    message: string;
}

export interface AuthenticationContent {
    authentication_piechart: AuthenticationPiechart[];
}

export interface AuthenticationPiechart {
    tactic: string;
    count:  number;
}

export interface CveBarchart {
    success: boolean;
    content: CveBarchartContent;
    message: string;
}

export interface CveBarchartContent {
    cve_barchart: any[];
}

export interface TypeEventTable {
    success: boolean;
    content: EventTableContent;
    message: string;
}

export interface EventTableContent {
    event_table: EventTableElement[];
}

export interface EventTableElement {
    timestamp:         Date;
    agent_name:        AgentNameEnum;
    rule_description:  string;
    rule_mitre_tactic: RuleMitreTactic;
    rule_mitre_id:     RuleMitreID;
    rule_level:        number;
}

export enum RuleMitreID {
    Empty = "",
    T1021002 = "T1021.002",
    T1098 = "T1098",
    T1110 = "T1110",
    T1203 = "T1203",
    T1489 = "T1489",
}

export enum RuleMitreTactic {
    CredentialAccess = "Credential Access",
    DefenseEvasion = "Defense Evasion",
    Empty = "",
    Execution = "Execution",
    Impact = "Impact",
    LateralMovement = "Lateral Movement",
    Persistence = "Persistence",
}

export interface MaliciousFile {
    success: boolean;
    content: MaliciousFileContent;
    message: string;
}

export interface MaliciousFileContent {
    malicious_file_barchart: MaliciousFileBarchart[];
}

export interface MaliciousFileBarchart {
    name:  string;
    count: number;
}

export interface TtpLinechart {
    success: boolean;
    content: TtpLinechartContent;
    message: string;
}

export interface TtpLinechartContent {
    tactic_linechart: TacticLinechart[];
}

export interface TacticLinechart {
    label: Label[];
    datas: Data[];
}

export interface Data {
    name: RuleMitreTactic;
    type: string;
    data: Datum[];
}

export interface Datum {
    time:  Date;
    value: number;
}

export interface Label {
    label: RuleMitreTactic;
}
