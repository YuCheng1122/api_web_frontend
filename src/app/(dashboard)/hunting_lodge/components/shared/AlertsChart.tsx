'use client';

import { FC } from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, CheckCircle } from 'lucide-react';
import type { Alerts } from '../../../../../features/dashboard_v2/types';

// 原 constants.ts 中的配置
const SEVERITY_CONFIG = [
    {
        name: 'Critical',
        color: 'hsl(var(--destructive))',
        bgColor: 'hsl(var(--destructive) / 0.2)',
        icon: AlertOctagon,
        getValue: (data: Alerts) => data.content.alerts.critical_severity
    },
    {
        name: 'High',
        color: 'hsl(var(--chart-3))',
        bgColor: 'hsl(var(--chart-3) / 0.2)',
        icon: AlertTriangle,
        getValue: (data: Alerts) => data.content.alerts.high_severity
    },
    {
        name: 'Medium',
        color: 'hsl(var(--chart-4))',
        bgColor: 'hsl(var(--chart-4) / 0.2)',
        icon: AlertCircle,
        getValue: (data: Alerts) => data.content.alerts.medium_severity
    },
    {
        name: 'Low',
        color: 'hsl(var(--chart-2))',
        bgColor: 'hsl(var(--chart-2) / 0.2)',
        icon: CheckCircle,
        getValue: (data: Alerts) => data.content.alerts.low_severity
    }
];

interface Props {
    data: Alerts;
}

const AlertsChart: FC<Props> = ({ data }) => {
    const total = SEVERITY_CONFIG.reduce((sum, config) => sum + config.getValue(data), 0);
    const criticalPlusHigh = SEVERITY_CONFIG[0].getValue(data) + SEVERITY_CONFIG[1].getValue(data);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">警報嚴重程度分佈</h2>

            {/* 主要內容區域 */}
            <div className="space-y-4 sm:space-y-6">
                {/* 移動端卡片 / 桌面端條形圖 */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                    {SEVERITY_CONFIG.map((config) => {
                        const value = config.getValue(data);
                        const percentage = total > 0 ? (value / total * 100).toFixed(1) : '0';
                        const Icon = config.icon;

                        return (
                            <div
                                key={config.name}
                                className="p-3 rounded-lg bg-accent"
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
                                <div className="text-xs text-muted-foreground">
                                    {percentage}% of total
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 桌面端條形圖 */}
                <div className="hidden sm:block space-y-4">
                    {SEVERITY_CONFIG.map((config) => {
                        const value = config.getValue(data);
                        const percentage = total > 0 ? (value / total * 100) : 0;
                        const Icon = config.icon;

                        return (
                            <div key={config.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-5 h-5" style={{ color: config.color }} />
                                        <span className="text-sm font-medium text-card-foreground">
                                            {config.name}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {value} ({percentage.toFixed(1)}%)
                                    </div>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            backgroundColor: config.color,
                                            width: `${percentage}%`
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
                                {window.innerWidth >= 640 ? '警報總數' : 'Total Alerts'}
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-card-foreground">{total}</div>
                        </div>
                        <div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                {window.innerWidth >= 640 ? '嚴重 + 高風險' : 'Critical + High'}
                            </div>
                            <div className="text-lg sm:text-2xl font-bold text-destructive">
                                {criticalPlusHigh}
                            </div>
                        </div>
                    </div>
                    {SEVERITY_CONFIG[0].getValue(data) > 0 && (
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-destructive">
                            ⚠️ {SEVERITY_CONFIG[0].getValue(data)} {window.innerWidth >= 640 ? '個嚴重警報需要立即處理' : 'critical alerts need attention'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertsChart;
