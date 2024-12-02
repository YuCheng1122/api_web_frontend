'use client';

import { FC } from 'react';
import { Clock, User } from 'lucide-react';
import type { EventCardProps } from '../../types';
import { getSeverityLevel, formatTime } from '../../utils';
import { SEVERITY_COLORS } from '../../constants';

export const MobileEventCard: FC<EventCardProps> = ({ event, isAnimating }) => {
    const severity = getSeverityLevel(event.rule_level);
    const colors = SEVERITY_COLORS[severity];

    return (
        <div
            className={`
                border-l-4 rounded p-2 transition-all duration-500
                ${colors.bg} ${colors.border} ${colors.text}
                ${isAnimating ? 'animate-slide-in' : ''}
                hover:shadow-md
            `}
        >
            <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                    <div className="text-xs font-medium line-clamp-2">
                        {event.rule_description}
                    </div>
                    <div className={`
                        shrink-0 px-1.5 py-0.5 rounded text-xs font-medium
                        ${colors.bg} ${colors.text}
                    `}>
                        {event.rule_level}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.agent_name}
                    </span>
                </div>
            </div>
        </div>
    );
};
