'use client';

import type { Alerts } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: Alerts;
}

const SEVERITY_CONFIG = [
    {
        name: 'Critical',
        color: '#DC2626', // red-600
        bgColor: '#FEE2E2', // red-100
        getValue: (data: Alerts) => data.content.alerts.critical_severity
    },
    {
        name: 'High',
        color: '#F97316', // orange-500
        bgColor: '#FFEDD5', // orange-100
        getValue: (data: Alerts) => data.content.alerts.high_severity
    },
    {
        name: 'Medium',
        color: '#FBBF24', // amber-400
        bgColor: '#FEF3C7', // amber-100
        getValue: (data: Alerts) => data.content.alerts.medium_severity
    },
    {
        name: 'Low',
        color: '#22C55E', // green-500
        bgColor: '#DCFCE7', // green-100
        getValue: (data: Alerts) => data.content.alerts.low_severity
    }
];

export default function AlertsChart({ data }: Props) {
    const total = SEVERITY_CONFIG.reduce((sum, config) => sum + config.getValue(data), 0);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Alert Severity Distribution</h2>
            <div className="grid grid-cols-4 gap-3">
                {SEVERITY_CONFIG.map((config) => {
                    const value = config.getValue(data);
                    const percentage = total > 0 ? (value / total * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={config.name}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: config.bgColor }}
                        >
                            <div className="text-sm text-gray-600 mb-1">{config.name}</div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: config.color }}
                            >
                                {value}
                            </div>
                            <div className="text-sm text-gray-500">
                                {percentage}% of total
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
