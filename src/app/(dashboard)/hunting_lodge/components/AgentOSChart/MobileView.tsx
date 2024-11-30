'use client';

import { FC } from 'react';
import type { AgentOS } from '../../../../../features/dashboard_v2/types';
import { COLORS, getOSIcon } from './utils';

interface MobileViewProps {
    osData: AgentOS['content']['agent_os'];
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({ osData, total }) => {
    return (
        <div className="grid grid-cols-1 gap-2">
            {osData.map((item) => {
                const color = COLORS[item.os as keyof typeof COLORS] || COLORS.default;
                const percentage = ((item.count / total) * 100).toFixed(1);
                const iconClass = getOSIcon(item.os);

                return (
                    <div
                        key={item.os}
                        className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${color}10` }}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <i
                                className={`${iconClass} text-xl`}
                                style={{ color }}
                            ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs text-gray-600 line-clamp-2"
                                title={item.os}
                            >
                                {item.os}
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
