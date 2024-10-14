import { useState, useEffect } from 'react';
import { fetchAgentData } from '@/utils/dashboard/fetchAgentData';
import { fetchEventTrendData } from '@/utils/dashboard/fetchEventTrendData';
import { fetchPieGraphData } from '@/utils/dashboard/fetchPieGaphData1';

interface DashboardInfo {
    totalAgents: number;
    activeAgents: number;
    latestEventTrends: Array<{ name: string; value: number }>;
    topAgent: string;
    topEvent: string;
}

const useDashboardInfo = () => {
    const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo>({
        totalAgents: 0,
        activeAgents: 0,
        latestEventTrends: [],
        topAgent: '',
        topEvent: '',
    });

    useEffect(() => {
        const fetchDashboardInfo = async () => {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            try {
                const [agentData, eventTrendData, pieGraphData] = await Promise.all([
                    fetchAgentData({ start: oneDayAgo, end: now }),
                    fetchEventTrendData({ start: oneDayAgo, end: now }),
                    fetchPieGraphData({ start: oneDayAgo, end: now })
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