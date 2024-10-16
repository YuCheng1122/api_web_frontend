import { useState, useEffect } from 'react';
import { fetchAgentData } from '@/utils/dashboard/fetchAgentData';
import { fetchEventTrendData } from '@/utils/dashboard/fetchEventTrendData';
import { fetchPieGraphData } from '@/utils/dashboard/fetchPieGaphData1';
import { fetchEventTableData } from '@/utils/dashboard/fetchEventTableData';
import { fetchNetworkConnection } from '@/utils/dashboard/fetchNetworkConnection';

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
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            try {
                const [agentData, eventTrendData, pieGraphData, eventTableData, networkConnection] = await Promise.all([
                    fetchAgentData({ start: oneDayAgo, end: now }),
                    fetchEventTrendData({ start: oneDayAgo, end: now }),
                    fetchPieGraphData({ start: oneDayAgo, end: now }),
                    fetchEventTableData({ id: 0, start: oneDayAgo, end: now, limit: 10 }),
                    fetchNetworkConnection({ start: oneDayAgo, end: now })
                ]);

                const newInfo: DashboardInfo = {
                    totalAgents: agentData.success ? agentData.content.find(a => a.agent_name === "Total agents")?.data || 0 : 0,
                    activeAgents: agentData.success ? agentData.content.find(a => a.agent_name === "Active agents")?.data || 0 : 0,
                    latestEventTrends: eventTrendData.success
                        ? eventTrendData.content.datas.map(d => ({
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
                            total: agentData.success ? agentData.content.find(a => a.agent_name === "Windows agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find(a => a.agent_name === "Active Windows agents")?.data || 0 : 0,
                        },
                        linux: {
                            total: agentData.success ? agentData.content.find(a => a.agent_name === "Linux agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find(a => a.agent_name === "Active Linux agents")?.data || 0 : 0,
                        },
                        macos: {
                            total: agentData.success ? agentData.content.find(a => a.agent_name === "MacOs agents")?.data || 0 : 0,
                            active: agentData.success ? agentData.content.find(a => a.agent_name === "Active MacOS agents")?.data || 0 : 0,
                        },
                    },
                };

                setDashboardInfo(newInfo);
            } catch (error) {
                console.error('Error fetching dashboard info:', error);
            }
        };

        fetchDashboardInfo();
    }, []);

    return dashboardInfo;
};

export default useDashboardInfo;