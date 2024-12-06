'use client';

import { FC } from 'react';
import { Key, ShieldAlert, UserCheck } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { Authentication } from '../../../../../features/dashboard_v2/types';

// Enhanced color palette with gradients
const COLORS = [
    {
        base: 'hsl(210, 85%, 50%)',  // Vibrant blue
        gradient: 'linear-gradient(90deg, hsl(210, 85%, 50%), hsl(220, 85%, 55%))'
    },
    {
        base: 'hsl(150, 75%, 40%)',  // Rich green
        gradient: 'linear-gradient(90deg, hsl(150, 75%, 40%), hsl(160, 75%, 45%))'
    },
    {
        base: 'hsl(280, 70%, 45%)',  // Royal purple
        gradient: 'linear-gradient(90deg, hsl(280, 70%, 45%), hsl(290, 70%, 50%))'
    },
    {
        base: 'hsl(340, 75%, 50%)',  // Rose pink
        gradient: 'linear-gradient(90deg, hsl(340, 75%, 50%), hsl(350, 75%, 55%))'
    },
    {
        base: 'hsl(25, 85%, 55%)',   // Warm orange
        gradient: 'linear-gradient(90deg, hsl(25, 85%, 55%), hsl(35, 85%, 60%))'
    }
] as const;

const AuthenticationChart: FC = () => {
    const { authentication } = useDashboard();

    if (!authentication) {
        return (
            <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">身份驗證策略分佈</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    const tactics = authentication.content.authentication_piechart;
    const total = tactics.reduce((sum, item) => sum + item.count, 0);
    const maxCount = Math.max(...tactics.map(t => t.count));

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">身份驗證策略分佈</h2>

            {/* 統計卡片 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-0 order-1 sm:order-2">
                <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS[0].base }} />
                        <span className="text-xs sm:text-sm font-medium text-card-foreground">
                            事件總數
                        </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold" style={{ color: COLORS[0].base }}>
                        {total}
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm hidden sm:block" style={{ color: COLORS[0].base }}>
                        驗證嘗試次數
                    </div>
                </div>

                <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: COLORS[1].base }} />
                        <span className="text-xs sm:text-sm font-medium text-card-foreground">
                            主要策略
                        </span>
                    </div>
                    <div className="text-sm sm:text-lg font-bold line-clamp-1"
                        style={{ color: COLORS[1].base }}
                        title={tactics[0]?.tactic}>
                        {tactics[0]?.tactic || '無資料'}
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm hidden sm:block" style={{ color: COLORS[1].base }}>
                        {tactics[0]?.count || 0} 個事件
                    </div>
                </div>
            </div>

            {/* 主要內容區域 */}
            <div className="space-y-2 sm:space-y-4 order-2 sm:order-1 mt-3 sm:mt-6">
                {tactics.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const relativeWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                    return (
                        <div
                            key={item.tactic}
                            className="sm:space-y-2"
                        >
                            {/* 移動端顯示 */}
                            <div className="flex sm:hidden items-center p-2 rounded-lg transition-all duration-300 hover:scale-[1.02] bg-accent/50 hover:bg-accent/70 backdrop-blur-sm"
                                style={{ borderLeft: `4px solid ${color.base}` }}>
                                <div className="flex-shrink-0 mr-3">
                                    <Key
                                        className="w-5 h-5"
                                        style={{ color: color.base }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-card-foreground line-clamp-1" title={item.tactic}>
                                        {item.tactic}
                                    </div>
                                </div>
                                <div className="text-lg font-bold ml-3 whitespace-nowrap" style={{ color: color.base }}>
                                    {item.count}
                                </div>
                            </div>

                            {/* 桌面端顯示 */}
                            <div className="hidden sm:block space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Key className="w-4 h-4" style={{ color: color.base }} />
                                        <span className="text-sm font-medium text-card-foreground">
                                            {item.tactic}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: color.base }}>
                                        {item.count}
                                    </div>
                                </div>
                                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                                    <div
                                        className="h-full rounded-lg transition-all duration-500 flex items-center px-3 hover:brightness-110"
                                        style={{
                                            background: color.gradient,
                                            width: `${Math.max(relativeWidth, 5)}%`,
                                            minWidth: '40px',
                                            boxShadow: `0 0 10px ${color.base}40`
                                        }}
                                    >
                                        <span className="text-xs font-medium text-white drop-shadow-md">
                                            {item.count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AuthenticationChart;
