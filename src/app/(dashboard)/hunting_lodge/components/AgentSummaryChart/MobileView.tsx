'use client';

import { FC } from 'react';

interface MobileViewProps {
    connected_agents: number;
    disconnected_agents: number;
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({
    connected_agents,
    disconnected_agents,
    total
}) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Connected</div>
                <div className="text-xl font-bold text-green-600">
                    {connected_agents}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                    {((connected_agents / total) * 100).toFixed(1)}% of total
                </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Disconnected</div>
                <div className="text-xl font-bold text-red-600">
                    {disconnected_agents}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                    {((disconnected_agents / total) * 100).toFixed(1)}% of total
                </div>
            </div>
        </div>
    );
};
