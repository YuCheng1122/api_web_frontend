export interface EventTable {
    success: boolean;
    content: Content;
    message: string;
}

export interface Content {
    event_table: EventTableElement[];
}

export interface EventTableElement {
    timestamp:         Date;
    agent_name:        AgentName;
    rule_description:  string;
    rule_mitre_tactic: RuleMitreTactic;
    rule_mitre_id:     RuleMitreID;
    rule_level:        number;
}

export enum AgentName {
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
    Empty = "",
    Execution = "Execution",
    Impact = "Impact",
    LateralMovement = "Lateral Movement",
    Persistence = "Persistence",
}
