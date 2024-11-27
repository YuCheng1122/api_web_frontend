'use client';

import { FC } from 'react';
import type { CustomTooltipProps } from '../types';
import { getSeriesColor } from '../utils';

export const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200 max-w-[280px] sm:max-w-none">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {new Date(label || '').toLocaleString()}
            </p>
            <div className="space-y-1 sm:space-y-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                style={{ backgroundColor: getSeriesColor(entry.name) }}
                            />
                            <span className="text-xs sm:text-sm text-gray-700">{entry.name}</span>
                        </div>
                        <span
                            className="text-xs sm:text-sm font-medium"
                            style={{ color: getSeriesColor(entry.name) }}
                        >
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
