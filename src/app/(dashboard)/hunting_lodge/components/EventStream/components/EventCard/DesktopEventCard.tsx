'use client';

import { FC } from 'react';
import { Clock, User, Target, Search } from 'lucide-react';
import type { EventCardProps } from '../../types';
import { getSeverityLevel, formatTime } from '../../utils';
import { SEVERITY_COLORS } from '../../constants';

export const DesktopEventCard: FC<EventCardProps> = ({ event, isAnimating }) => {
    const severity = getSeverityLevel(event.rule_level);
    const colors = SEVERITY_COLORS[severity];

    return (
        <div
            className={`
                border-l-4 rounded p-3 transition-all duration-500
                ${colors.bg} ${colors.border} ${colors.text}
                ${isAnimating ? 'animate-slide-in' : ''}
                hover:shadow-md
            `}
        >
            <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="text-sm font-medium line-clamp-2">
                        {event.rule_description}
                    </div>
                    <div className={`
                        shrink-0 px-2 py-1 rounded text-sm font-medium
                        ${colors.bg} ${colors.text}
                    `}>
                        Level {event.rule_level}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.timestamp)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {event.agent_name}
                    </span>
                    {event.rule_mitre_tactic && (
                        <span className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            {event.rule_mitre_tactic}
                        </span>
                    )}
                    {event.rule_mitre_id && (
                        <span className="flex items-center gap-1.5">
                            <Search className="w-4 h-4" />
                            {event.rule_mitre_id}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
