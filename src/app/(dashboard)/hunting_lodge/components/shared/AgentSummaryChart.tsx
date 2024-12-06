'use client';

import { FC } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

const AgentSummaryChart: FC = () => {
    const { agentSummary } = useDashboard();

    if (!agentSummary) {
        return (
            <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">代理狀態</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    const { connected_agents, disconnected_agents } = agentSummary.content.agent_summary;
    const total = connected_agents + disconnected_agents;

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">代理狀態</h2>

            <div className="space-y-3 sm:space-y-6">
                {/* 圓環圖 - 僅在桌面端顯示 */}
                <div className="hidden sm:flex justify-center">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* 背景圓環 */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="12"
                            />
                            {/* 數據圓環 */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="hsl(var(--chart-2))"
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
                                fill="hsl(var(--foreground))"
                            >
                                {total}
                            </text>
                            <text
                                x="50"
                                y="60"
                                textAnchor="middle"
                                className="text-sm"
                                fill="hsl(var(--muted-foreground))"
                            >
                                總計
                            </text>
                        </svg>
                    </div>
                </div>

                {/* 狀態卡片 */}
                <div className="grid grid-cols-2 gap-2 sm:gap-6">
                    <div className="bg-accent rounded-lg p-2 sm:p-4">
                        <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-chart-2" />
                            <span className="text-xs sm:text-sm font-medium text-card-foreground">已連接代理</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-chart-2 mb-0.5 sm:mb-1">
                            {connected_agents}
                        </div>
                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-chart-2 hidden sm:block">
                            運作中並回報中
                        </div>
                    </div>

                    <div className="bg-accent rounded-lg p-2 sm:p-4">
                        <div className="flex items-center gap-1.5 sm:gap-3 mb-1 sm:mb-2">
                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                            <span className="text-xs sm:text-sm font-medium text-card-foreground">已斷開代理</span>
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-destructive mb-0.5 sm:mb-1">
                            {disconnected_agents}
                        </div>
                        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-destructive hidden sm:block">
                            需要注意
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentSummaryChart;
