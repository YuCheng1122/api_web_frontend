'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { EventTableElement } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

const SEVERITY_COLORS = {
    critical: 'bg-red-100 border-red-500 text-red-800',
    high: 'bg-orange-100 border-orange-500 text-orange-800',
    medium: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    low: 'bg-green-100 border-green-500 text-green-800'
};

const getSeverityClass = (level: number) => {
    if (level >= 10) return SEVERITY_COLORS.critical;
    if (level >= 7) return SEVERITY_COLORS.high;
    if (level >= 4) return SEVERITY_COLORS.medium;
    return SEVERITY_COLORS.low;
};

export default function EventStream({ data, maxEvents = 10 }: Props) {
    const [events, setEvents] = useState<EventTableElement[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Format timestamp to local time
    const formatTime = (timestamp: Date) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // Add new events with animation
    const addEvent = useCallback((event: EventTableElement) => {
        const eventKey = `${event.timestamp}-${event.agent_name}-${event.rule_description}`;

        setAnimatingEvents(prev => new Set(prev).add(eventKey));
        setEvents(prev => [event, ...prev].slice(0, maxEvents));

        // Remove animation class after animation completes
        setTimeout(() => {
            setAnimatingEvents(prev => {
                const newSet = new Set(prev);
                newSet.delete(eventKey);
                return newSet;
            });
        }, 500);

        // Scroll the container to the top with smooth animation
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [maxEvents]);

    // Simulate real-time updates using the provided data
    useEffect(() => {
        if (!data.length) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < data.length) {
                addEvent(data[currentIndex]);
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
        }, 3000); // Add new event every 3 seconds

        return () => clearInterval(interval);
    }, [data, addEvent]);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Real-time Event Stream</h2>
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div
                    ref={containerRef}
                    className="h-[400px] overflow-y-auto space-y-3 scrollbar-hide"
                >
                    {events.map((event, index) => {
                        const eventKey = `${event.timestamp}-${event.agent_name}-${event.rule_description}`;
                        const isAnimating = animatingEvents.has(eventKey);

                        return (
                            <div
                                key={eventKey}
                                className={`
                                    border-l-4 rounded p-3 transition-all duration-500
                                    ${getSeverityClass(event.rule_level)}
                                    ${isAnimating ? 'animate-slide-in' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {event.rule_description}
                                        </div>
                                        <div className="text-sm mt-1 space-x-2">
                                            <span className="inline-block">
                                                🕒 {formatTime(event.timestamp)}
                                            </span>
                                            <span className="inline-block">
                                                👤 {event.agent_name}
                                            </span>
                                            {event.rule_mitre_tactic && (
                                                <span className="inline-block">
                                                    🎯 {event.rule_mitre_tactic}
                                                </span>
                                            )}
                                            {event.rule_mitre_id && (
                                                <span className="inline-block">
                                                    🔍 {event.rule_mitre_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`
                                        ml-4 px-2 py-1 rounded text-sm font-medium
                                        ${event.rule_level >= 10 ? 'bg-red-200' :
                                            event.rule_level >= 7 ? 'bg-orange-200' :
                                                event.rule_level >= 4 ? 'bg-yellow-200' :
                                                    'bg-green-200'}
                                    `}>
                                        Level {event.rule_level}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>
        </div>
    );
}
