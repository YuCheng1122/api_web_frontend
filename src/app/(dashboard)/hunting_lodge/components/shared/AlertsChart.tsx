'use client';

import { FC } from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, CheckCircle } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { Alerts } from '../../../../../features/dashboard_v2/types';

// Enhanced severity configuration with intuitive colors
const SEVERITY_CONFIG = [
    {
        name: 'Critical',
        color: 'hsl(0, 85%, 60%)',  // Bright red for critical
        bgColor: 'hsl(0, 85%, 60%, 0.2)',
        icon: AlertOctagon,
        getValue: (data: Alerts) => data.content.alerts.critical_severity
    },
    {
        name: 'High',
        color: 'hsl(25, 95%, 55%)',  // Vibrant orange for high
        bgColor: 'hsl(25, 95%, 55%, 0.2)',
        icon: AlertTriangle,
        getValue: (data: Alerts) => data.content.alerts.high_severity
    },
    {
        name: 'Medium',
        color: 'hsl(45, 90%, 50%)',  // Strong yellow for medium
        bgColor: 'hsl(45, 90%, 50%, 0.2)',
        icon: AlertCircle,
        getValue: (data: Alerts) => data.content.alerts.medium_severity
    },
    {
        name: 'Low',
        color: 'hsl(142, 70%, 45%)',  // Calming green for low
        bgColor: 'hsl(142, 70%, 45%, 0.2)',
        icon: CheckCircle,
        getValue: (data: Alerts) => data.content.alerts.low_severity
    }
];

const AlertsChart: FC = () => {
    const { alerts } = useDashboard();

    if (!alerts) {
        return (
            <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">警報嚴重程度分佈</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    const total = SEVERITY_CONFIG.reduce((sum, config) => sum + config.getValue(alerts), 0);
    const criticalPlusHigh = SEVERITY_CONFIG[0].getValue(alerts) + SEVERITY_CONFIG[1].getValue(alerts);
    const maxValue = Math.max(...SEVERITY_CONFIG.map(config => config.getValue(alerts)));

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">警報嚴重程度分佈</h2>

            {/* 主要內容區域 */}
            <div className="space-y-4 sm:space-y-6">
                {/* 移動端卡片 */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                    {SEVERITY_CONFIG.map((config) => {
                        const value = config.getValue(alerts);
                        const Icon = config.icon;

                        return (
                            <div
                                key={config.name}
                                className="p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                                style={{ borderLeft: `4px solid ${config.color}` }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                                    <div className="text-xs text-muted-foreground">{config.name}</div>
                                </div>
                                <div
                                    className="text-xl font-bold"
                                    style={{ color: config.color }}
                                >
                                    {value}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 桌面端條形圖 */}
                <div className="hidden sm:block space-y-4">
                    {SEVERITY_CONFIG.map((config) => {
                        const value = config.getValue(alerts);
                        const Icon = config.icon;
                        const relativeWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;

                        return (
                            <div key={config.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                                        <span className="text-sm font-medium text-card-foreground">
                                            {config.name}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium" style={{ color: config.color }}>
                                        {value}
                                    </div>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            backgroundColor: config.color,
                                            width: `${Math.max(relativeWidth, 2)}%`,
                                            boxShadow: `0 0 8px ${config.bgColor}`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 統計摘要 */}
                <div className="bg-muted rounded-lg p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                警報總數
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-card-foreground">{total}</div>
                        </div>
                        <div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                嚴重 + 高風險
                            </div>
                            <div className="text-lg sm:text-2xl font-bold" style={{ color: SEVERITY_CONFIG[0].color }}>
                                {criticalPlusHigh}
                            </div>
                        </div>
                    </div>
                    {SEVERITY_CONFIG[0].getValue(alerts) > 0 && (
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm" style={{ color: SEVERITY_CONFIG[0].color }}>
                            ⚠️ {SEVERITY_CONFIG[0].getValue(alerts)} 個嚴重警報需要立即處理
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertsChart;
