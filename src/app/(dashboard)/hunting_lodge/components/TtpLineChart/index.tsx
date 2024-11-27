'use client';

import { useState, useEffect } from 'react';
import type { TtpLinechart } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { transformDataForCharts, calculateTrendSummary, getSeriesColor } from './utils';

interface Props {
    data: TtpLinechart;
}

export default function TtpLineChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const chartData = data.content.tactic_linechart[0];

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    if (!chartData) return null;

    // Transform data for charts
    const timePoints = transformDataForCharts(chartData);

    // Calculate trend summary
    const { criticalCount, increasingTrends } = calculateTrendSummary(timePoints);

    const sharedProps = {
        timePoints,
        chartData,
        criticalCount,
        increasingTrends,
        getSeriesColor,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">MITRE Tactics Distribution Over Time</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
