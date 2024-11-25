'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import type { AgentSummary } from '@/features/dashboard_v2/types';

interface Props {
    data: AgentSummary;
}

export default function AgentSummaryChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const { connected_agents, disconnected_agents } = data.content.agent_summary;
    const total = connected_agents + disconnected_agents;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // 移動端視圖
    const MobileView = () => (
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

    // 桌面端視圖
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 圓環圖 */}
            <div className="flex justify-center">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* 背景圓環 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="12"
                        />
                        {/* 數據圓環 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="12"
                            strokeDasharray={`${(connected_agents / total) * 251.2} 251.2`}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                        />
                        {/* 中心文字 */}
                        <text
                            x="50"
                            y="45"
                            textAnchor="middle"
                            className="text-2xl font-bold"
                            fill="#111827"
                        >
                            {total}
                        </text>
                        <text
                            x="50"
                            y="60"
                            textAnchor="middle"
                            className="text-sm"
                            fill="#6B7280"
                        >
                            Total
                        </text>
                    </svg>
                </div>
            </div>

            {/* 詳細資訊 */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Connected Agents</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                        {connected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        {((connected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        Active and reporting
                    </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">Disconnected Agents</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">
                        {disconnected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        {((disconnected_agents / total) * 100).toFixed(1)}% of total
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                        Requires attention
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Agent Status</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
