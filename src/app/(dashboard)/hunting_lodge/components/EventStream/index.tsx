'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { EventTableElement } from '../../../../../features/dashboard_v2/types';
import type { EventWithId } from './types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { createEventWithId, formatTime, groupEventsBySeverity } from './utils';

interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

export default function EventStream({ data, maxEvents = 10 }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const [events, setEvents] = useState<EventWithId[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
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

    const addEvent = useCallback((event: EventTableElement) => {
        const eventWithId = createEventWithId(event);

        setAnimatingEvents(prev => new Set(prev).add(eventWithId._id));
        setEvents(prev => {
            const newEvents = [eventWithId, ...prev].slice(0, maxEvents);
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

    const timelineData = groupEventsBySeverity(events);

    const sharedProps = {
        events,
        animatingEvents,
        selectedSeverity,
        containerRef,
        timelineRef,
        handleSeverityChange,
        isMobile,
        timelineData,
        formatTime,
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">即時事件流</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
