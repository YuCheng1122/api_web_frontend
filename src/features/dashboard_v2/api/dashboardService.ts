import { avocadoClient } from '@/features/api/AvocadoClient';
import type { TimeRange } from '@/features/dashboard_v2';
import type {
    AgentSummary,
    AgentOS,
    Alerts,
    TtpLinechart,
    MaliciousFile,
    Authentication,
    EventTable as EventTableType
} from '../types';

export interface CriticalData {
    agentSummary: AgentSummary;
    alerts: Alerts;
}

export interface ChartData {
    ttpLinechart: TtpLinechart;
    maliciousFile: MaliciousFile;
    authentication: Authentication;
}

export class DashboardService {
    private static readonly ENDPOINTS = {
        AGENT_SUMMARY: '/api/dashboard/agent_summary',
        AGENT_OS: '/api/dashboard/agent_os',
        ALERTS: '/api/dashboard/alerts',
        TTP_LINECHART: '/api/dashboard/tactic_linechart',
        MALICIOUS_FILE: '/api/dashboard/malicious_file_barchart',
        AUTHENTICATION: '/api/dashboard/authentication_piechart',
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
    static async fetchEventTableData(timeRange: TimeRange): Promise<EventTableType> {
        return this.fetchEndpoint<EventTableType>(this.ENDPOINTS.EVENT_TABLE, timeRange);
    }

    // Fetch chart data (TTP, Malicious Files, Authentication)
    static async fetchChartData(timeRange: TimeRange): Promise<ChartData> {
        const [ttpLinechart, maliciousFile, authentication] = await Promise.all([
            this.fetchEndpoint<TtpLinechart>(this.ENDPOINTS.TTP_LINECHART, timeRange),
            this.fetchEndpoint<MaliciousFile>(this.ENDPOINTS.MALICIOUS_FILE, timeRange),
            this.fetchEndpoint<Authentication>(this.ENDPOINTS.AUTHENTICATION, timeRange),
        ]);

        return { ttpLinechart, maliciousFile, authentication };
    }
}
