'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import * as d3 from 'd3';
import { Clock, User, Target, Search } from 'lucide-react';
import type { EventTableElement } from '@/features/dashboard_v2/types';

interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

interface EventGroup {
    severity: 'critical' | 'high' | 'medium' | 'low';
    count: number;
    events: EventTableElement[];
}

interface EventWithId extends EventTableElement {
    _id: string;
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

let eventCounter = 0;
const generateEventId = () => {
    eventCounter += 1;
    return `event-${Date.now()}-${eventCounter}`;
};

export default function EventStream({ data, maxEvents = 10 }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [events, setEvents] = useState<EventWithId[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
    const [timelineData, setTimelineData] = useState<EventGroup[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const formatTime = (timestamp: Date) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const groupEventsBySeverity = useCallback((events: EventWithId[]): EventGroup[] => {
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

    const updateTimeline = useCallback(() => {
        if (!timelineRef.current) return;

        const width = timelineRef.current.clientWidth;
        const height = isMobile ? 40 : 50;
        const margin = { top: 8, right: 8, bottom: 8, left: 8 };

        const svg = d3.select(timelineRef.current);
        svg.selectAll('*').remove();

        const grouped = groupEventsBySeverity(events);
        const total = grouped.reduce((sum, g) => sum + g.count, 0);

        if (total === 0) {
            svg.append('rect')
                .attr('x', margin.left)
                .attr('y', margin.top)
                .attr('width', width - margin.left - margin.right)
                .attr('height', height - margin.top - margin.bottom)
                .attr('fill', '#E5E7EB')
                .attr('opacity', 0.5)
                .attr('rx', 3);
            return;
        }

        let x = margin.left;
        grouped.forEach(group => {
            if (group.count === 0) return;

            const barWidth = (group.count / total) * (width - margin.left - margin.right);

            if (!isNaN(barWidth) && barWidth > 0) {
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', margin.top)
                    .attr('width', barWidth)
                    .attr('height', height - margin.top - margin.bottom)
                    .attr('fill', SEVERITY_COLORS[group.severity].fill)
                    .attr('opacity', 0.7)
                    .attr('rx', 3);

                if (barWidth > 30) {
                    svg.append('text')
                        .attr('x', x + barWidth / 2)
                        .attr('y', height / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', 'white')
                        .attr('font-size', isMobile ? '8px' : '10px')
                        .text(`${group.count}`);
                }

                x += barWidth;
            }
        });
    }, [events, groupEventsBySeverity, isMobile]);

    const addEvent = useCallback((event: EventTableElement) => {
        const eventWithId: EventWithId = {
            ...event,
            _id: generateEventId()
        };

        setAnimatingEvents(prev => new Set(prev).add(eventWithId._id));
        setEvents(prev => {
            const newEvents = [eventWithId, ...prev].slice(0, maxEvents);
            setTimelineData(groupEventsBySeverity(newEvents));
            return newEvents;
        });

        setTimeout(() => {
            setAnimatingEvents(prev => {
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
    }, [maxEvents, groupEventsBySeverity]);

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

    useEffect(() => {
        updateTimeline();
    }, [events, updateTimeline]);

    const filteredEvents = events.filter(event =>
        selectedSeverity === 'all' || getSeverityLevel(event.rule_level) === selectedSeverity
    );

    // 移動端事件卡片
    const MobileEventCard = ({ event, isAnimating }: { event: EventWithId; isAnimating: boolean }) => {
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

    // 桌面端事件卡片
    const DesktopEventCard = ({ event, isAnimating }: { event: EventWithId; isAnimating: boolean }) => {
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

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Real-time Event Stream</h2>

            {/* Timeline Visualization */}
            <div className="mb-3 sm:mb-4">
                <svg ref={timelineRef} className="w-full" height={isMobile ? "40" : "50"} />
            </div>

            {/* Severity Filter */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <button
                    onClick={() => setSelectedSeverity('all')}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === 'all'
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
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === severity
                                ? `${colors.bg} ${colors.text} font-medium`
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                ))}
            </div>

            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-b from-white to-transparent z-10"></div>
                <div
                    ref={containerRef}
                    className="h-[300px] sm:h-[400px] overflow-y-auto space-y-2 sm:space-y-3"
                >
                    {filteredEvents.map((event) => (
                        isMobile ? (
                            <MobileEventCard
                                key={event._id}
                                event={event}
                                isAnimating={animatingEvents.has(event._id)}
                            />
                        ) : (
                            <DesktopEventCard
                                key={event._id}
                                event={event}
                                isAnimating={animatingEvents.has(event._id)}
                            />
                        )
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>
        </div>
    );
}
