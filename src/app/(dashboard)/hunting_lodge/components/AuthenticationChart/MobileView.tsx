'use client';

import { FC } from 'react';
import { Key } from 'lucide-react';
import type { Authentication } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface MobileViewProps {
    tactics: Authentication['content']['authentication_piechart'];
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({ tactics, total }) => {
    return (
        <div className="space-y-2">
            {tactics.map((item, index) => {
                const color = COLORS[index % COLORS.length];
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                return (
                    <div
                        key={item.tactic}
                        className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${color}10` }}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <Key
                                className="w-5 h-5"
                                style={{ color }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs text-gray-600 line-clamp-1"
                                title={item.tactic}
                            >
                                {item.tactic}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {percentage}% of total
                            </div>
                        </div>
                        <div
                            className="text-lg font-bold ml-3 whitespace-nowrap"
                            style={{ color }}
                        >
                            {item.count}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
