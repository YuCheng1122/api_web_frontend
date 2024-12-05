'use client';

import { FC, useCallback, useRef, useEffect, useState } from 'react';
import type { EventTableElement } from '../../../../../features/dashboard_v2/types';
import { DashboardService } from '../../../../../features/dashboard_v2/api/dashboardService';

// Enhanced color configuration
const SEVERITY_COLORS = {
    critical: {
        base: 'hsl(0, 85%, 60%)',
        bg: 'bg-[hsl(0,85%,60%)]/10',
        text: 'text-[hsl(0,85%,60%)]'
    },
    high: {
        base: 'hsl(25, 85%, 55%)',
        bg: 'bg-[hsl(25,85%,55%)]/10',
        text: 'text-[hsl(25,85%,55%)]'
    },
    medium: {
        base: 'hsl(45, 90%, 50%)',
        bg: 'bg-[hsl(45,90%,50%)]/10',
        text: 'text-[hsl(45,90%,50%)]'
    },
    low: {
        base: 'hsl(150, 75%, 40%)',
        bg: 'bg-[hsl(150,75%,40%)]/10',
        text: 'text-[hsl(150,75%,40%)]'
    }
} as const;

// Types
interface EventWithId extends EventTableElement {
    _id: string;
    uniqueKey: string;
}

interface EventCardProps {
    event: EventWithId;
    isAnimating: boolean;
}

// Utility Functions
const generateEventId = () => `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateUniqueKey = (event: EventTableElement) => {
    // Create a unique key based on event content
    return `${event.timestamp}-${event.rule_level}-${event.agent_name}-${event.rule_description}`;
};

const getSeverityLevel = (level: number): keyof typeof SEVERITY_COLORS => {
    if (level >= 10) return 'critical';
    if (level >= 7) return 'high';
    if (level >= 4) return 'medium';
    return 'low';
};

const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? '下午' : '上午';
    const formattedHours = hours % 12 || 12;

    return `${ampm}${formattedHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const createEventWithId = (event: EventTableElement): EventWithId => ({
    ...event,
    _id: generateEventId(),
    uniqueKey: generateUniqueKey(event)
});

// Event Card Component
const EventCard: FC<EventCardProps> = ({ event, isAnimating }) => {
    const severity = getSeverityLevel(event.rule_level);
    const colors = SEVERITY_COLORS[severity];

    return (
        <div
            className={`
                relative p-2 transition-all duration-300
                ${colors.bg} ${colors.text}
                ${isAnimating ? 'animate-slide-in' : ''}
            `}
        >
            <div className="space-y-1">
                <div className="text-sm">
                    {event.rule_description}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span>Level {event.rule_level}</span>
                    <span>{formatTime(event.timestamp)}</span>
                    <span>{event.agent_name}</span>
                </div>
            </div>
        </div>
    );
};

// Main Component
interface Props {
    maxEvents?: number;
    pollInterval?: number; // in milliseconds
}

const EventStream: FC<Props> = ({ maxEvents = 50, pollInterval = 3000 }) => {
    const [events, setEvents] = useState<EventWithId[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastEventTimestampRef = useRef<Date | null>(null);
    const seenEventsRef = useRef<Set<string>>(new Set());

    const addNewEvents = useCallback((newEvents: EventTableElement[]) => {
        const processedEvents = newEvents
            .map(createEventWithId)
            .filter(event => !seenEventsRef.current.has(event.uniqueKey));

        if (processedEvents.length === 0) return;

        // Add new unique keys to seen events
        processedEvents.forEach(event => {
            seenEventsRef.current.add(event.uniqueKey);
        });

        setEvents(prevEvents => {
            // Combine existing and new events, sort by timestamp (newest last)
            const combined = [...prevEvents, ...processedEvents].sort((a, b) => {
                const timeA = new Date(a.timestamp).getTime();
                const timeB = new Date(b.timestamp).getTime();
                if (timeA === timeB) {
                    // If timestamps are equal, maintain stable order using IDs
                    return a._id.localeCompare(b._id);
                }
                return timeA - timeB;
            });

            // Keep only the most recent events up to maxEvents
            return combined.slice(-maxEvents);
        });

        // Animate new events
        const newEventIds = new Set(processedEvents.map(event => event._id));
        setAnimatingEvents(newEventIds);
        setTimeout(() => {
            setAnimatingEvents(new Set());
        }, 500);

        // Auto-scroll to bottom
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [maxEvents]);

    const fetchEvents = useCallback(async () => {
        try {
            const timeRange = {
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                end_time: new Date().toISOString()
            };

            const response = await DashboardService.fetchEventTableData(timeRange);
            if (!response.success || !response.content.event_table) return;

            const newEvents = response.content.event_table.filter(event => {
                const eventTime = new Date(event.timestamp);
                return !lastEventTimestampRef.current || eventTime > lastEventTimestampRef.current;
            });

            if (newEvents.length > 0) {
                addNewEvents(newEvents);
                lastEventTimestampRef.current = new Date(
                    Math.max(...newEvents.map(e => new Date(e.timestamp).getTime()))
                );
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoading(false);
        }
    }, [addNewEvents]);

    // Initial fetch and polling setup
    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, pollInterval);
        return () => clearInterval(interval);
    }, [fetchEvents, pollInterval]);

    return (
        <div className="w-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground">即時事件流</h2>

            <div className="relative">
                <div
                    ref={containerRef}
                    className="h-[400px] overflow-y-auto space-y-1"
                >
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            isAnimating={animatingEvents.has(event._id)}
                        />
                    ))}
                    {isLoading && events.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                            載入中...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventStream;
