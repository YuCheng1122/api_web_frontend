import type { EventTableElement } from '../../../../../features/dashboard_v2/types';
import type { EventGroup, EventWithId } from './types';
import { SEVERITY_COLORS } from './constants';

let eventCounter = 0;
export const generateEventId = () => {
    eventCounter += 1;
    return `event-${Date.now()}-${eventCounter}`;
};

export const getSeverityLevel = (level: number): keyof typeof SEVERITY_COLORS => {
    if (level >= 10) return 'critical';
    if (level >= 7) return 'high';
    if (level >= 4) return 'medium';
    return 'low';
};

export const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString();
};

export const groupEventsBySeverity = (events: EventWithId[]): EventGroup[] => {
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
};

export const createEventWithId = (event: EventTableElement): EventWithId => ({
    ...event,
    _id: generateEventId()
});

export const filterEventsBySeverity = (events: EventWithId[], selectedSeverity: string) => {
    return events.filter(event =>
        selectedSeverity === 'all' || getSeverityLevel(event.rule_level) === selectedSeverity
    );
};
