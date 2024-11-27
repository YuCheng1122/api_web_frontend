'use client';

import { useState, useEffect, useMemo } from 'react';
import type { EventTable } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { calculateFrequencies, calculateMaxCount, calculateSummary, getColor } from './utils';

interface Props {
    data: EventTable;
}

export default function MitreHeatmapChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Calculate frequencies of tactics and techniques
    const frequencies = useMemo(() => calculateFrequencies(data), [data]);

    // Calculate max count for color scaling
    const maxCount = useMemo(() => calculateMaxCount(frequencies), [frequencies]);

    // Calculate summary statistics
    const summary = useMemo(() => calculateSummary(frequencies, maxCount), [frequencies, maxCount]);

    // Create color getter function
    const colorGetter = (count: number) => getColor(count, maxCount);

    const sharedProps = {
        frequencies,
        summary,
        maxCount,
        getColor: colorGetter,
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE ATT&CK Matrix</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
