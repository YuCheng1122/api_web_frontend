'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import type { EventTableElement } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

interface EventGroup {
    severity: 'critical' | 'high' | 'medium' | 'low';
    count: number;
    events: EventTableElement[];
}

const SEVERITY_COLORS = {
    critical: {
        bg: 'bg-red-100',
        border: 'border-red-500',
        text: 'text-red-800',
        fill: '#EF4444'
    },
    high: {
        bg: 'bg-orange-100',
        border: 'border-orange-500',
        text: 'text-orange-800',
        fill: '#F97316'
    },
    medium: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        text: 'text-yellow-800',
        fill: '#F59E0B'
    },
    low: {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-800',
        fill: '#10B981'
    }
};

const getSeverityLevel = (level: number): keyof typeof SEVERITY_COLORS => {
    if (level >= 10) return 'critical';
    if (level >= 7) return 'high';
    if (level >= 4) return 'medium';
    return 'low';
};

export default function EventStream({ data, maxEvents = 10 }: Props) {
    const [events, setEvents] = useState<EventTableElement[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
    const [timelineData, setTimelineData] = useState<EventGroup[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<SVGSVGElement>(null);

    // Format timestamp to local time
    const formatTime = (timestamp: Date) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // Group events by severity
    const groupEventsBySeverity = useCallback((events: EventTableElement[]): EventGroup[] => {
        const groups: Record<string, EventGroup> = {
            critical: { severity: 'critical', count: 0, events: [] },
            high: { severity: 'high', count: 0, events: [] },
            medium: { severity: 'medium', count: 0, events: [] },
            low: { severity: 'low', count: 0, events: [] }
        };

        events.forEach(event => {
            const severity = getSeverityLevel(event.rule_level);
            groups[severity].count++;
            groups[severity].events.push(event);
        });

        return Object.values(groups);
    }, []);

    // Update timeline visualization
    const updateTimeline = useCallback(() => {
        if (!timelineRef.current) return;

        const width = timelineRef.current.clientWidth;
        const height = 60;
        const margin = { top: 10, right: 30, bottom: 20, left: 30 };

        const svg = d3.select(timelineRef.current);
        svg.selectAll('*').remove();

        const grouped = groupEventsBySeverity(events);
        const total = grouped.reduce((sum, g) => sum + g.count, 0);

        let x = margin.left;
        grouped.forEach(group => {
            const width = (group.count / total) * (timelineRef.current!.clientWidth - margin.left - margin.right);

            svg.append('rect')
                .attr('x', x)
                .attr('y', margin.top)
                .attr('width', width)
                .attr('height', height - margin.top - margin.bottom)
                .attr('fill', SEVERITY_COLORS[group.severity].fill)
                .attr('opacity', 0.7)
                .attr('rx', 4);

            if (width > 40) {
                svg.append('text')
                    .attr('x', x + width / 2)
                    .attr('y', height / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', 'white')
                    .attr('font-size', '12px')
                    .text(`${group.count}`);
            }

            x += width;
        });
    }, [events, groupEventsBySeverity]);

    // Add new events with animation
    const addEvent = useCallback((event: EventTableElement) => {
        const eventKey = `${event.timestamp}-${event.agent_name}-${event.rule_description}`;

        setAnimatingEvents(prev => new Set(prev).add(eventKey));
        setEvents(prev => {
            const newEvents = [event, ...prev].slice(0, maxEvents);
            setTimelineData(groupEventsBySeverity(newEvents));
            return newEvents;
        });

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
    }, [maxEvents, groupEventsBySeverity]);

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

    // Update timeline when events change
    useEffect(() => {
        updateTimeline();
    }, [events, updateTimeline]);

    const filteredEvents = events.filter(event =>
        selectedSeverity === 'all' || getSeverityLevel(event.rule_level) === selectedSeverity
    );

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Real-time Event Stream</h2>

            {/* Timeline Visualization */}
            <div className="mb-4">
                <svg ref={timelineRef} className="w-full" height="60" />
            </div>

            {/* Severity Filter */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSelectedSeverity('all')}
                    className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === 'all'
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                >
                    All
                </button>
                {Object.entries(SEVERITY_COLORS).map(([severity, colors]) => (
                    <button
                        key={severity}
                        onClick={() => setSelectedSeverity(severity)}
                        className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === severity
                                ? `${colors.bg} ${colors.text} font-medium`
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                ))}
            </div>

            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div
                    ref={containerRef}
                    className="h-[400px] overflow-y-auto space-y-3 scrollbar-hide"
                >
                    {filteredEvents.map((event) => {
                        const eventKey = `${event.timestamp}-${event.agent_name}-${event.rule_description}`;
                        const isAnimating = animatingEvents.has(eventKey);
                        const severity = getSeverityLevel(event.rule_level);
                        const colors = SEVERITY_COLORS[severity];

                        return (
                            <div
                                key={eventKey}
                                className={`
                                    border-l-4 rounded p-3 transition-all duration-500
                                    ${colors.bg} ${colors.border} ${colors.text}
                                    ${isAnimating ? 'animate-slide-in' : ''}
                                    hover:shadow-md
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
                                        ${colors.bg} ${colors.text}
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
