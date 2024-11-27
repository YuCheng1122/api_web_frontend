'use client';

import { FC } from 'react';
import type { Alerts } from '../../../../../features/dashboard_v2/types';
import { SEVERITY_CONFIG } from './constants';

interface MobileViewProps {
    data: Alerts;
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({ data, total }) => {
    return (
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
};
