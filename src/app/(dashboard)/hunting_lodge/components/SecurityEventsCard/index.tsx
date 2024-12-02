'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../../features/auth/contexts/AuthContext';
import type { EventTable } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface Props {
    data: EventTable;
}

interface Event {
    rule_level: number;
}

export default function SecurityEventsCard({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const { isadmin } = useAuthContext();
    const events = data.content.event_table as Event[];
    const totalEvents = events.length;

    // Calculate severity counts
    const criticalEvents = events.filter((e: Event) => e.rule_level >= 10).length;
    const highEvents = events.filter((e: Event) => e.rule_level >= 7 && e.rule_level < 10).length;
    const mediumEvents = events.filter((e: Event) => e.rule_level >= 4 && e.rule_level < 7).length;
    const lowEvents = events.filter((e: Event) => e.rule_level < 4).length;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleEventsClick = () => {
        router.push('/hunting_lodge/events');
    };

    const handleNetworkClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/network');
    };

    const handleThreatHuntingClick = () => {
        if (!isadmin) {
            alert('This feature is only available for administrators');
            return;
        }
        router.push('/hunting_lodge/threat-hunting');
    };

    const sharedProps = {
        totalEvents,
        criticalEvents,
        highEvents,
        mediumEvents,
        lowEvents,
        handleEventsClick,
        handleNetworkClick,
        handleThreatHuntingClick,
        isadmin,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">安全事件</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
