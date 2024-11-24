'use client';

import type { AgentSummary } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: AgentSummary;
}

export default function AgentSummaryChart({ data }: Props) {
    const { connected_agents, disconnected_agents } = data.content.agent_summary;
    const total = connected_agents + disconnected_agents;

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Connected</div>
                    <div className="text-2xl font-bold text-green-600">
                        {connected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        {((connected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Disconnected</div>
                    <div className="text-2xl font-bold text-red-600">
                        {disconnected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        {((disconnected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                </div>
            </div>
        </div>
    );
}
