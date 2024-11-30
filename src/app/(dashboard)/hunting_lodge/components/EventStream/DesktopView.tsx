'use client';

import { FC } from 'react';
import type { ViewProps } from './types';
import { Timeline } from './components/Timeline';
import { DesktopEventCard } from './components/EventCard/DesktopEventCard';
import { SEVERITY_COLORS } from './constants';
import { filterEventsBySeverity } from './utils';

export const DesktopView: FC<ViewProps> = ({
    events,
    animatingEvents,
    selectedSeverity,
    containerRef,
    timelineRef,
    handleSeverityChange,
    isMobile
}) => {
    const filteredEvents = filterEventsBySeverity(events, selectedSeverity);

    return (
        <div className="space-y-4">
            {/* 時間軸視覺化 */}
            <div>
                <Timeline
                    timelineRef={timelineRef}
                    events={events}
                    isMobile={isMobile}
                />
            </div>

            {/* 嚴重程度篩選 */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleSeverityChange('all')}
                    className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === 'all'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    全部
                </button>
                {Object.entries(SEVERITY_COLORS).map(([severity, colors]) => {
                    const severityText = {
                        'critical': '嚴重',
                        'high': '高風險',
                        'medium': '中風險',
                        'low': '低風險'
                    }[severity] || severity.charAt(0).toUpperCase() + severity.slice(1);

                    return (
                        <button
                            key={severity}
                            onClick={() => handleSeverityChange(severity)}
                            className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === severity
                                ? `${colors.bg} ${colors.text} font-medium`
                                : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            {severityText}
                        </button>
                    );
                })}
            </div>

            {/* 事件列表 */}
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div
                    ref={containerRef}
                    className="h-[400px] overflow-y-auto space-y-3"
                >
                    {filteredEvents.map((event) => (
                        <DesktopEventCard
                            key={event._id}
                            event={event}
                            isAnimating={animatingEvents.has(event._id)}
                        />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>
        </div>
    );
};
