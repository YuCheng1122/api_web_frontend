'use client';

import type { AgentSummary } from '@/features/dashboard_v2/types';

interface Props {
    data: AgentSummary;
}

export default function AgentSummaryChart({ data }: Props) {
    const { connected_agents, disconnected_agents } = data.content.agent_summary;
    const total = connected_agents + disconnected_agents;

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Agent Status</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Connected</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {connected_agents}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {((connected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                </div>
                <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Disconnected</div>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                        {disconnected_agents}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {((disconnected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                </div>
            </div>
        </div>
    );
}
