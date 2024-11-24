import { avocadoClient } from '@/features/api/AvocadoClient';
import type { TimeRange } from '../types';
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

export interface CriticalData {
    agentSummary: AgentSummary;
    alerts: Alerts;
}

export interface RemainingData {
    tactics: Tactics;
    cveBarchart: CveBarchart;
    ttpLinechart: TtpLinechart;
    maliciousFile: MaliciousFile;
    authentication: Authentication;
    agentName: AgentName;
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

    // Fetch critical data first (summary and alerts)
    static async fetchCriticalData(timeRange: TimeRange): Promise<CriticalData> {
        const [agentSummary, alerts] = await Promise.all([
            this.fetchEndpoint<AgentSummary>(this.ENDPOINTS.AGENT_SUMMARY, timeRange),
            this.fetchEndpoint<Alerts>(this.ENDPOINTS.ALERTS, timeRange),
        ]);

        return { agentSummary, alerts };
    }

    // Fetch OS data separately
    static async fetchOSData(timeRange: TimeRange): Promise<AgentOS> {
        return this.fetchEndpoint<AgentOS>(this.ENDPOINTS.AGENT_OS, timeRange);
    }

    // Fetch event table data separately
    static async fetchEventTableData(timeRange: TimeRange): Promise<EventTable> {
        return this.fetchEndpoint<EventTable>(this.ENDPOINTS.EVENT_TABLE, timeRange);
    }

    // Fetch remaining data in background if needed
    static async fetchRemainingData(timeRange: TimeRange): Promise<RemainingData> {
        const [
            tactics,
            cveBarchart,
            ttpLinechart,
            maliciousFile,
            authentication,
            agentName,
        ] = await Promise.all([
            this.fetchEndpoint<Tactics>(this.ENDPOINTS.TACTICS, timeRange),
            this.fetchEndpoint<CveBarchart>(this.ENDPOINTS.CVE_BARCHART, timeRange),
            this.fetchEndpoint<TtpLinechart>(this.ENDPOINTS.TTP_LINECHART, timeRange),
            this.fetchEndpoint<MaliciousFile>(this.ENDPOINTS.MALICIOUS_FILE, timeRange),
            this.fetchEndpoint<Authentication>(this.ENDPOINTS.AUTHENTICATION, timeRange),
            this.fetchEndpoint<AgentName>(this.ENDPOINTS.AGENT_NAME, timeRange),
        ]);

        return {
            tactics,
            cveBarchart,
            ttpLinechart,
            maliciousFile,
            authentication,
            agentName,
        };
    }
}
