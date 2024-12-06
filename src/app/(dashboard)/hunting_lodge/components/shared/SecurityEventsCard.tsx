'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, AlertTriangle, Shield, Clock, Network, Crosshair } from 'lucide-react';
import { useAuthContext } from '../../../../../core/contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import type { EventTable } from '../../../../../features/dashboard_v2/types';

// Enhanced color configuration with gradients
const SEVERITY_COLORS = {
    critical: {
        base: 'hsl(0, 85%, 60%)',    // Bright red
        gradient: 'linear-gradient(45deg, hsl(0, 85%, 60%), hsl(10, 85%, 65%))'
    },
    high: {
        base: 'hsl(25, 85%, 55%)',   // Warm orange
        gradient: 'linear-gradient(45deg, hsl(25, 85%, 55%), hsl(35, 85%, 60%))'
    },
    medium: {
        base: 'hsl(45, 90%, 50%)',   // Strong yellow
        gradient: 'linear-gradient(45deg, hsl(45, 90%, 50%), hsl(55, 90%, 55%))'
    },
    low: {
        base: 'hsl(150, 75%, 40%)',  // Rich green
        gradient: 'linear-gradient(45deg, hsl(150, 75%, 40%), hsl(160, 75%, 45%))'
    }
} as const;

interface Event {
    rule_level: number;
}

const SecurityEventsCard: FC = () => {
    const router = useRouter();
    const { isadmin } = useAuthContext();
    const { eventTable } = useDashboard();

    if (!eventTable) {
        return (
            <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">安全事件</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    const events = eventTable.content.event_table as Event[];
    const totalEvents = events.length;

    // Calculate severity counts
    const criticalEvents = events.filter((e: Event) => e.rule_level >= 10).length;
    const highEvents = events.filter((e: Event) => e.rule_level >= 7 && e.rule_level < 10).length;
    const mediumEvents = events.filter((e: Event) => e.rule_level >= 4 && e.rule_level < 7).length;
    const lowEvents = events.filter((e: Event) => e.rule_level < 4).length;

    const handleEventsClick = () => {
        router.push('/hunting_lodge/events');
    };

    const handleNetworkClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/network');
    };

    const handleThreatHuntingClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/threat-hunting');
    };

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">安全事件</h2>

            {/* 主要統計區塊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6">
                {/* 總事件數 */}
                <div className="relative overflow-hidden bg-primary/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-primary-foreground hover:bg-primary transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent"></div>
                    <div className="relative">
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8 mb-4" />
                        <div className="text-2xl sm:text-3xl font-bold mb-2">{totalEvents}</div>
                        <div className="text-sm sm:text-base opacity-90">安全事件總數</div>
                        <div className="mt-4 text-xs sm:text-sm opacity-75">
                            最後更新：{new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* 嚴重程度統計 */}
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
                    <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-accent/70 transition-colors">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{ color: SEVERITY_COLORS.critical.base }} />
                        <div className="text-lg sm:text-2xl font-bold" style={{ color: SEVERITY_COLORS.critical.base }}>{criticalEvents}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            嚴重事件
                        </div>
                    </div>
                    <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 hover:bg-accent/70 transition-colors">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{ color: SEVERITY_COLORS.high.base }} />
                        <div className="text-lg sm:text-2xl font-bold" style={{ color: SEVERITY_COLORS.high.base }}>{highEvents}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            高風險事件
                        </div>
                    </div>
                    <div className="bg-accent/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 block sm:hidden hover:bg-accent/70 transition-colors">
                        <Shield className="w-5 h-5 mb-2" style={{ color: SEVERITY_COLORS.medium.base }} />
                        <div className="text-lg font-bold" style={{ color: SEVERITY_COLORS.medium.base }}>{mediumEvents}</div>
                        <div className="text-xs text-muted-foreground">中風險事件</div>
                    </div>
                </div>
            </div>

            {/* 嚴重程度分佈 - 僅在桌面版顯示 */}
            <div className="hidden sm:block bg-accent/50 backdrop-blur-sm rounded-lg p-6 mb-6 hover:bg-accent/70 transition-colors">
                <h3 className="text-sm font-medium text-card-foreground mb-4">嚴重程度分佈</h3>
                <div className="space-y-4">
                    {[
                        { label: '嚴重', count: criticalEvents, colors: SEVERITY_COLORS.critical },
                        { label: '高風險', count: highEvents, colors: SEVERITY_COLORS.high },
                        { label: '中風險', count: mediumEvents, colors: SEVERITY_COLORS.medium },
                        { label: '低風險', count: lowEvents, colors: SEVERITY_COLORS.low }
                    ].map(item => {
                        const maxCount = Math.max(criticalEvents, highEvents, mediumEvents, lowEvents);
                        const relativeWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                        return (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className="font-medium" style={{ color: item.colors.base }}>{item.count}</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            background: item.colors.gradient,
                                            width: `${Math.max(relativeWidth, 2)}%`,
                                            boxShadow: `0 0 8px ${item.colors.base}40`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 快速操作按鈕 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={handleEventsClick}
                    className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-accent/50 backdrop-blur-sm rounded-lg hover:bg-accent/70 transition-all duration-300 hover:scale-[1.02] group"
                >
                    <Clock className="w-5 h-5 text-chart-1 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-card-foreground">查看事件</span>
                </button>
                {isadmin && (
                    <>
                        <button
                            onClick={handleNetworkClick}
                            className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-accent/50 backdrop-blur-sm rounded-lg hover:bg-accent/70 transition-all duration-300 hover:scale-[1.02] group"
                        >
                            <Network className="w-5 h-5 text-chart-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-card-foreground">查看網路</span>
                        </button>
                        <button
                            onClick={handleThreatHuntingClick}
                            className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-accent/50 backdrop-blur-sm rounded-lg hover:bg-accent/70 transition-all duration-300 hover:scale-[1.02] group"
                        >
                            <Crosshair className="w-5 h-5 text-chart-4 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-card-foreground">威脅獵捕</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SecurityEventsCard;
