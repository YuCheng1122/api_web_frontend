'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, CheckCircle } from 'lucide-react';
import type { Alerts } from '@/features/dashboard_v2/types';

interface Props {
    data: Alerts;
}

const SEVERITY_CONFIG = [
    {
        name: 'Critical',
        color: '#DC2626', // red-600
        bgColor: '#FEE2E2', // red-100
        icon: AlertOctagon,
        getValue: (data: Alerts) => data.content.alerts.critical_severity
    },
    {
        name: 'High',
        color: '#F97316', // orange-500
        bgColor: '#FFEDD5', // orange-100
        icon: AlertTriangle,
        getValue: (data: Alerts) => data.content.alerts.high_severity
    },
    {
        name: 'Medium',
        color: '#FBBF24', // amber-400
        bgColor: '#FEF3C7', // amber-100
        icon: AlertCircle,
        getValue: (data: Alerts) => data.content.alerts.medium_severity
    },
    {
        name: 'Low',
        color: '#22C55E', // green-500
        bgColor: '#DCFCE7', // green-100
        icon: CheckCircle,
        getValue: (data: Alerts) => data.content.alerts.low_severity
    }
];

export default function AlertsChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const total = SEVERITY_CONFIG.reduce((sum, config) => sum + config.getValue(data), 0);

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
        <div className="grid grid-cols-2 gap-2">
            {SEVERITY_CONFIG.map((config) => {
                const value = config.getValue(data);
                const percentage = total > 0 ? (value / total * 100).toFixed(1) : '0';
                const Icon = config.icon;

                return (
                    <div
                        key={config.name}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: config.bgColor }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" style={{ color: config.color }} />
                            <div className="text-xs text-gray-600">{config.name}</div>
                        </div>
                        <div
                            className="text-xl font-bold"
                            style={{ color: config.color }}
                        >
                            {value}
                        </div>
                        <div className="text-xs text-gray-500">
                            {percentage}% of total
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // 桌面端視圖
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 水平條形圖 */}
            <div className="space-y-4">
                {SEVERITY_CONFIG.map((config) => {
                    const value = config.getValue(data);
                    const percentage = total > 0 ? (value / total * 100) : 0;
                    const Icon = config.icon;

                    return (
                        <div key={config.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {config.name}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {value} ({percentage.toFixed(1)}%)
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

            {/* 詳細統計 */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Total Alerts</div>
                        <div className="text-2xl font-bold text-gray-900">{total}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Critical + High</div>
                        <div className="text-2xl font-bold text-red-600">
                            {SEVERITY_CONFIG[0].getValue(data) + SEVERITY_CONFIG[1].getValue(data)}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    {SEVERITY_CONFIG[0].getValue(data) > 0 && (
                        <div className="text-red-600">
                            ⚠️ {SEVERITY_CONFIG[0].getValue(data)} critical alerts require immediate attention
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Alert Severity Distribution</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
