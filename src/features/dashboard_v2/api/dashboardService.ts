import { avocadoClient } from '@/core/https/AvocadoClient';
import { memoryCache } from '@/core/cache/memoryCache';
import type { TimeRange } from '@/features/dashboard_v2';
import type {
    AgentSummary,
    AgentOS,
    Alerts,
    TtpLinechart,
    MaliciousFile,
    Authentication,
    EventTable as EventTableType,
    CveBarchart
} from '../types';

export interface CriticalData {
    agentSummary: AgentSummary;
    alerts: Alerts;
}

export interface ChartData {
    ttpLinechart: TtpLinechart;
    maliciousFile: MaliciousFile;
    authentication: Authentication;
    cveBarchart: CveBarchart[];
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
        CVE_BARCHART: '/api/dashboard/cve_barchart',
    } as const;

    private static getCacheKey(endpoint: string, timeRange: TimeRange): string {
        return `dashboard:${endpoint}:${timeRange.start_time}:${timeRange.end_time}`;
    }

    private static async fetchWithCache<T>(
        endpoint: string, 
        timeRange: TimeRange, 
        useCache: boolean = true,
        ttl: number = 300
    ): Promise<T> {
        if (useCache) {
            const cacheKey = this.getCacheKey(endpoint, timeRange);
            const cachedData = memoryCache.get<T>(cacheKey);
            
            if (cachedData) {
                return cachedData;
            }

            const data = await avocadoClient.get<T>(endpoint, {
                params: timeRange
            });

            memoryCache.set(cacheKey, data, ttl);
            return data;
        }

        // 不使用緩存，直接獲取新數據
        return avocadoClient.get<T>(endpoint, {
            params: timeRange
        });
    }

    // 獲取關鍵數據（使用緩存）
    static async fetchCriticalData(timeRange: TimeRange): Promise<CriticalData> {
        const [agentSummary, alerts] = await Promise.all([
            this.fetchWithCache<AgentSummary>(this.ENDPOINTS.AGENT_SUMMARY, timeRange),
            this.fetchWithCache<Alerts>(this.ENDPOINTS.ALERTS, timeRange),
        ]);

        return { agentSummary, alerts };
    }

    // 獲取OS數據（使用緩存）
    static async fetchOSData(timeRange: TimeRange): Promise<AgentOS> {
        return this.fetchWithCache<AgentOS>(this.ENDPOINTS.AGENT_OS, timeRange);
    }

    // 獲取事件表數據（可選是否使用緩存）
    static async fetchEventTableData(timeRange: TimeRange, useCache: boolean = true): Promise<EventTableType> {
        return this.fetchWithCache<EventTableType>(this.ENDPOINTS.EVENT_TABLE, timeRange, useCache);
    }

    // 獲取圖表數據（使用緩存）
    static async fetchChartData(timeRange: TimeRange): Promise<ChartData> {
        const [ttpLinechart, maliciousFile, authentication, cveBarchart] = await Promise.all([
            this.fetchWithCache<TtpLinechart>(this.ENDPOINTS.TTP_LINECHART, timeRange),
            this.fetchWithCache<MaliciousFile>(this.ENDPOINTS.MALICIOUS_FILE, timeRange),
            this.fetchWithCache<Authentication>(this.ENDPOINTS.AUTHENTICATION, timeRange),
            this.fetchWithCache<{ content: { cve_barchart: CveBarchart[] } }>(this.ENDPOINTS.CVE_BARCHART, timeRange)
                .then(response => response.content.cve_barchart),
        ]);

        return { ttpLinechart, maliciousFile, authentication, cveBarchart };
    }

    // 清除特定時間範圍的緩存
    static clearCache(timeRange: TimeRange): void {
        Object.values(this.ENDPOINTS).forEach(endpoint => {
            const cacheKey = this.getCacheKey(endpoint, timeRange);
            memoryCache.delete(cacheKey);
        });
    }

    // 清除所有緩存
    static clearAllCache(): void {
        memoryCache.clear();
    }
}
