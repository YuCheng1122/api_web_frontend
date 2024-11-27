'use client';

import { FC } from 'react';
import type { ViewProps } from './types';
import { Timeline } from './components/Timeline';
import { MobileEventCard } from './components/EventCard/MobileEventCard';
import { SEVERITY_COLORS } from './constants';
import { filterEventsBySeverity } from './utils';

export const MobileView: FC<ViewProps> = ({
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
        <div className="space-y-3">
            {/* Timeline Visualization */}
            <div>
                <Timeline
                    timelineRef={timelineRef}
                    events={events}
                    isMobile={isMobile}
                />
            </div>

            {/* Severity Filter */}
            <div className="flex flex-wrap gap-1.5">
                <button
                    onClick={() => handleSeverityChange('all')}
                    className={`px-2 py-1 rounded-full text-xs ${selectedSeverity === 'all'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    All
                </button>
                {Object.entries(SEVERITY_COLORS).map(([severity, colors]) => (
                    <button
                        key={severity}
                        onClick={() => handleSeverityChange(severity)}
                        className={`px-2 py-1 rounded-full text-xs ${selectedSeverity === severity
                                ? `${colors.bg} ${colors.text} font-medium`
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                ))}
            </div>

            {/* Event List */}
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div
                    ref={containerRef}
                    className="h-[300px] overflow-y-auto space-y-2"
                >
                    {filteredEvents.map((event) => (
                        <MobileEventCard
                            key={event._id}
                            event={event}
                            isAnimating={animatingEvents.has(event._id)}
                        />
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent"></div>
            </div>
        </div>
    );
};
