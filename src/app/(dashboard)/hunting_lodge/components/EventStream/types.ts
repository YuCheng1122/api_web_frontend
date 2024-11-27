import type { EventTableElement } from '../../../../../features/dashboard_v2/types';
import type { SEVERITY_COLORS } from './constants';

export interface EventWithId extends EventTableElement {
    _id: string;
}

export interface EventGroup {
    severity: keyof typeof SEVERITY_COLORS;
    count: number;
    events: EventTableElement[];
}

export interface EventCardProps {
    event: EventWithId;
    isAnimating: boolean;
}

export interface ViewProps {
    events: EventWithId[];
    animatingEvents: Set<string>;
    selectedSeverity: string;
    timelineData: EventGroup[];
    containerRef: React.RefObject<HTMLDivElement>;
    timelineRef: React.RefObject<SVGSVGElement>;
    handleSeverityChange: (severity: string) => void;
    formatTime: (timestamp: Date) => string;
    isMobile: boolean;
}

export interface TimelineProps {
    timelineRef: React.RefObject<SVGSVGElement>;
    events: EventWithId[];
    isMobile: boolean;
}
