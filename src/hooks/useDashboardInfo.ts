import { useState, useEffect } from 'react';
import { fetchAgentData } from '../utils/dashboard/fetchAgentData';
import { fetchEventTrendData } from '../utils/dashboard/fetchEventTrendData';
import { fetchPieGraphData } from '../utils/dashboard/fetchPieGaphData1';
import { fetchEventTableData } from '../utils/dashboard/fetchEventTableData';
import { fetchNetworkConnection } from '../utils/dashboard/fetchNetworkConnection';

interface AgentDataType {
    agent_name: string;
    data: number | null;
}

interface EventTrendData {
    name: string;
    data: Array<[string, number]>;
}

interface DashboardInfo {
    totalAgents: number;
    activeAgents: number;
    latestEventTrends: Array<{ name: string; value: number }>;
    topAgent: string;
    topEvent: string;
    topMitre: string;
    totalEvents: number;
    recentEvents: Array<{
        time: string;
        agent_name: string;
        rule_description: string;
        rule_mitre_tactic: string;
        rule_mitre_id: string;
        rule_level: number;
    }>;
    agentDistribution: {
        windows: { total: number; active: number };
        linux: { total: number; active: number };
        macos: { total: number; active: number };
    };
}

const useDashboardInfo = () => {
    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo>({
        totalAgents: 0,
        activeAgents: 0,
        latestEventTrends: [],
        topAgent: '',
        topEvent: '',
        topMitre: '',
        totalEvents: 0,
        recentEvents: [],
        agentDistribution: {
            windows: { total: 0, active: 0 },
            linux: { total: 0, active: 0 },
            macos: { total: 0, active: 0 },
        },
    });

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            const now = new Date();
            const twentyEightHoursAgo = new Date(now.getTime() - 28 * 60 * 60 * 1000);

            console.log('Fetching dashboard info for time range:', {
                start: twentyEightHoursAgo.toISOString(),
                end: now.toISOString()
            });

            try {
                // 分開執行每個請求以便更好地追蹤錯誤
                console.log('Fetching agent data...');
                const agentData = await fetchAgentData({ start: twentyEightHoursAgo, end: now });
                if (!agentData.success) {
                    console.error('Agent data fetch failed:', agentData.error);
                }

                console.log('Fetching event trend data...');
                const eventTrendData = await fetchEventTrendData({ start: twentyEightHoursAgo, end: now });
                if (!eventTrendData.success) {
                    console.error('Event trend data fetch failed');
                }

                console.log('Fetching pie graph data...');
                const pieGraphData = await fetchPieGraphData({ start: twentyEightHoursAgo, end: now });
                if (!pieGraphData.success) {
                    console.error('Pie graph data fetch failed');
                }

                console.log('Fetching event table data...');
                const eventTableData = await fetchEventTableData({ 
                    id: 0, 
                    start: twentyEightHoursAgo, 
                    end: now, 
                    limit: 10 
                });
                if (!eventTableData.success) {
                    console.error('Event table data fetch failed');
                }

                console.log('Fetching network connection data...');
                const networkConnection = await fetchNetworkConnection({ start: twentyEightHoursAgo, end: now });
                if (!networkConnection.success) {
                    console.error('Network connection data fetch failed');
                }

                console.log('All data fetched, processing results...');

                const newInfo: DashboardInfo = {
                    totalAgents: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Total agents")?.data || 0 : 0,
                    activeAgents: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Active agents")?.data || 0 : 0,
                    latestEventTrends: eventTrendData.success
                        ? eventTrendData.content.datas.map((d: EventTrendData) => ({
                            name: d.name,
                            value: d.data[d.data.length - 1][1]
                        }))
                        : [],
                    topAgent: pieGraphData.success ? pieGraphData.content.top_agents[0]?.name || 'N/A' : 'N/A',
                    topEvent: pieGraphData.success ? pieGraphData.content.top_events[0]?.name || 'N/A' : 'N/A',
                    topMitre: pieGraphData.success ? pieGraphData.content.top_mitre[0]?.name || 'N/A' : 'N/A',
                    totalEvents: networkConnection.success ? parseInt(networkConnection.content.count) : 0,
                    recentEvents: eventTableData.success ? eventTableData.content.datas : [],
                    agentDistribution: {
                        windows: {
                            total: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Windows agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Active Windows agents")?.data || 0 : 0,
                        },
                        linux: {
                            total: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Linux agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Active Linux agents")?.data || 0 : 0,
                        },
                        macos: {
                            total: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "MacOs agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find((a: AgentDataType) => a.agent_name === "Active MacOS agents")?.data || 0 : 0,
                        },
                    },
                };

                console.log('Setting new dashboard info:', newInfo);
                setDashboardInfo(newInfo);
            } catch (error) {
                console.error('Error in fetchDashboardInfo:', error);
                if (error instanceof Error) {
                    console.error('Error details:', {
                        message: error.message,
                        stack: error.stack
                    });
                }
            }
        };

        fetchDashboardInfo();
    }, []);

    return dashboardInfo;
};

export default useDashboardInfo;
