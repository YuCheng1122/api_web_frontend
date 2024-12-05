'use client';

import { FC, useCallback, useRef, useEffect, useState } from 'react';
import type { EventTableElement } from '../../../../../features/dashboard_v2/types';
import type { EventWithId } from './types';
import { Timeline } from './components/Timeline';
import { EventCard } from './components/EventCard';
import { SEVERITY_COLORS } from './constants';
import { createEventWithId, formatTime, groupEventsBySeverity, filterEventsBySeverity } from './utils';

interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

const EventStream: FC<Props> = ({ data, maxEvents = 10 }) => {
    const [events, setEvents] = useState<EventWithId[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<SVGSVGElement>(null);

    const addEvent = useCallback((event: EventTableElement) => {
        const eventWithId = createEventWithId(event);

        setAnimatingEvents((prev: Set<string>) => new Set(prev).add(eventWithId._id));
        setEvents((prev: EventWithId[]) => {
            const newEvents = [eventWithId, ...prev].slice(0, maxEvents);
            return newEvents;
        });

        setTimeout(() => {
            setAnimatingEvents((prev: Set<string>) => {
                const newSet = new Set(prev);
                newSet.delete(eventWithId._id);
                return newSet;
            });
        }, 500);

        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [maxEvents]);

    useEffect(() => {
        if (!data.length) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < data.length) {
                addEvent(data[currentIndex]);
                currentIndex++;
            } else {
                currentIndex = 0;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [data, addEvent]);

    const handleSeverityChange = (severity: string) => {
        setSelectedSeverity(severity);
    };

    const filteredEvents = filterEventsBySeverity(events, selectedSeverity);
    const timelineData = groupEventsBySeverity(events);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">即時事件流</h2>

            <div className="space-y-3 sm:space-y-4">
                {/* Timeline Visualization */}
                <div>
                    <Timeline
                        timelineRef={timelineRef}
                        events={events}
                        isMobile={window.innerWidth < 640}
                    />
                </div>

                {/* Severity Filter */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                        onClick={() => handleSeverityChange('all')}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === 'all'
                                ? 'bg-gray-200 text-gray-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {window.innerWidth >= 640 ? '全部' : 'All'}
                    </button>
                    {Object.entries(SEVERITY_COLORS).map(([severity, colors]) => {
                        const severityText = window.innerWidth >= 640
                            ? {
                                'critical': '嚴重',
                                'high': '高風險',
                                'medium': '中風險',
                                'low': '低風險'
                            }[severity]
                            : severity.charAt(0).toUpperCase() + severity.slice(1);

                        return (
                            <button
                                key={severity}
                                onClick={() => handleSeverityChange(severity)}
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === severity
                                        ? `${colors.bg} ${colors.text} font-medium`
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {severityText}
                            </button>
                        );
                    })}
                </div>

                {/* Event List */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
                    <div
                        ref={containerRef}
                        className="h-[300px] sm:h-[400px] overflow-y-auto space-y-2 sm:space-y-3"
                    >
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                isAnimating={animatingEvents.has(event._id)}
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-t from-white to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default EventStream;
