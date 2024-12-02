import * as AgentSummaryTypes from './agent_summary';
import * as TacticsTypes from './tactics';
import * as AgentOSTypes from './agent_os';
import * as AlertsTypes from './alerts';
import * as CveBarchartTypes from './cve_barchart';
import * as TtpLinechartTypes from './ttp_linechart';
import * as MaliciousFileTypes from './malicious_file';
import * as AuthenticationTypes from './authentication';
import * as AgentNameTypes from './agent_name';
import * as EventTableTypes from './event_table';

export type AgentSummary = AgentSummaryTypes.AgentSummary;
export type Tactics = TacticsTypes.Tactics;
export type AgentOS = AgentOSTypes.AgentOS;
export type Alerts = AlertsTypes.Alerts;
export type CveBarchart = CveBarchartTypes.CveBarchart;
export type TtpLinechart = TtpLinechartTypes.TtpLinechart;
export type MaliciousFile = MaliciousFileTypes.MaliciousFile;
export type Authentication = AuthenticationTypes.Authentication;
export type AgentName = AgentNameTypes.AgentName;
export type EventTable = EventTableTypes.EventTable;

// Export additional types from EventTable
export type EventTableElement = EventTableTypes.EventTableElement;
export type { RuleMitreID, RuleMitreTactic } from './event_table';

// Export namespaced types for internal use if needed
export {
    AgentSummaryTypes,
    TacticsTypes,
    AgentOSTypes,
    AlertsTypes,
    CveBarchartTypes,
    TtpLinechartTypes,
    MaliciousFileTypes,
    AuthenticationTypes,
    AgentNameTypes,
    EventTableTypes
};
