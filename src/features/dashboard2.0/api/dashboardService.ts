import { avocadoClient } from '@/features/api/AvocadoClient';
import type {
    AgentSummary,
    Tactics,
    AgentOS,
    Alerts,
    CveBarchart,
    TtpLinechart,
    MaliciousFile,
    Authentication,
    AgentName,
    EventTable
} from '../types/generated';

export interface TimeRange {
    start_time: string;
    end_time: string;
}

export interface DashboardData {
    agentSummary: AgentSummary;
    tactics: Tactics;
    agentOS: AgentOS;
    alerts: Alerts;
    cveBarchart: CveBarchart;
    ttpLinechart: TtpLinechart;
    maliciousFile: MaliciousFile;
    authentication: Authentication;
    agentName: AgentName;
    eventTable: EventTable;
}

export class DashboardService {
    private static readonly ENDPOINTS = {
        AGENT_SUMMARY: '/api/dashboard/agent_summary',
        TACTICS: '/api/dashboard/agent_summary',
        AGENT_OS: '/api/dashboard/agent_os',
        ALERTS: '/api/dashboard/alerts',
        CVE_BARCHART: '/api/dashboard/cve_barchart',
        TTP_LINECHART: '/api/dashboard/tactic_linechart',
        MALICIOUS_FILE: '/api/dashboard/malicious_file_barchart',
        AUTHENTICATION: '/api/dashboard/authentication_piechart',
        AGENT_NAME: '/api/dashboard/agent_name',
        EVENT_TABLE: '/api/dashboard/event_table',
    } as const;

    private static async fetchEndpoint<T>(endpoint: string, timeRange: TimeRange): Promise<T> {
        return avocadoClient.get<T>(endpoint, {
            params: timeRange
        });
    }

    static async fetchDashboardData(timeRange: TimeRange): Promise<DashboardData> {
        const [
            agentSummary,
            tactics,
            agentOS,
            alerts,
            cveBarchart,
            ttpLinechart,
            maliciousFile,
            authentication,
            agentName,
            eventTable,
        ] = await Promise.all([
            this.fetchEndpoint<AgentSummary>(this.ENDPOINTS.AGENT_SUMMARY, timeRange),
            this.fetchEndpoint<Tactics>(this.ENDPOINTS.TACTICS, timeRange),
            this.fetchEndpoint<AgentOS>(this.ENDPOINTS.AGENT_OS, timeRange),
            this.fetchEndpoint<Alerts>(this.ENDPOINTS.ALERTS, timeRange),
            this.fetchEndpoint<CveBarchart>(this.ENDPOINTS.CVE_BARCHART, timeRange),
            this.fetchEndpoint<TtpLinechart>(this.ENDPOINTS.TTP_LINECHART, timeRange),
            this.fetchEndpoint<MaliciousFile>(this.ENDPOINTS.MALICIOUS_FILE, timeRange),
            this.fetchEndpoint<Authentication>(this.ENDPOINTS.AUTHENTICATION, timeRange),
            this.fetchEndpoint<AgentName>(this.ENDPOINTS.AGENT_NAME, timeRange),
            this.fetchEndpoint<EventTable>(this.ENDPOINTS.EVENT_TABLE, timeRange),
        ]);

        return {
            agentSummary,
            tactics,
            agentOS,
            alerts,
            cveBarchart,
            ttpLinechart,
            maliciousFile,
            authentication,
            agentName,
            eventTable,
        };
    }

    // Individual endpoint methods for when you only need specific data
    static async fetchAgentSummary(timeRange: TimeRange): Promise<AgentSummary> {
        return this.fetchEndpoint(this.ENDPOINTS.AGENT_SUMMARY, timeRange);
    }

    static async fetchTactics(timeRange: TimeRange): Promise<Tactics> {
        return this.fetchEndpoint(this.ENDPOINTS.TACTICS, timeRange);
    }

    static async fetchAgentOS(timeRange: TimeRange): Promise<AgentOS> {
        return this.fetchEndpoint(this.ENDPOINTS.AGENT_OS, timeRange);
    }

    static async fetchAlerts(timeRange: TimeRange): Promise<Alerts> {
        return this.fetchEndpoint(this.ENDPOINTS.ALERTS, timeRange);
    }

    static async fetchCveBarchart(timeRange: TimeRange): Promise<CveBarchart> {
        return this.fetchEndpoint(this.ENDPOINTS.CVE_BARCHART, timeRange);
    }

    static async fetchTtpLinechart(timeRange: TimeRange): Promise<TtpLinechart> {
        return this.fetchEndpoint(this.ENDPOINTS.TTP_LINECHART, timeRange);
    }

    static async fetchMaliciousFile(timeRange: TimeRange): Promise<MaliciousFile> {
        return this.fetchEndpoint(this.ENDPOINTS.MALICIOUS_FILE, timeRange);
    }

    static async fetchAuthentication(timeRange: TimeRange): Promise<Authentication> {
        return this.fetchEndpoint(this.ENDPOINTS.AUTHENTICATION, timeRange);
    }

    static async fetchAgentName(timeRange: TimeRange): Promise<AgentName> {
        return this.fetchEndpoint(this.ENDPOINTS.AGENT_NAME, timeRange);
    }

    static async fetchEventTable(timeRange: TimeRange): Promise<EventTable> {
        return this.fetchEndpoint(this.ENDPOINTS.EVENT_TABLE, timeRange);
    }
}
