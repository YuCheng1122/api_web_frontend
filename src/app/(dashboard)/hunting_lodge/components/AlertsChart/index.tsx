'use client';

import { useState, useEffect } from 'react';
import type { Alerts } from '../../../../../features/dashboard_v2/types';
import { SEVERITY_CONFIG } from './constants';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface Props {
    data: Alerts;
}

export default function AlertsChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const total = SEVERITY_CONFIG.reduce((sum, config) => sum + config.getValue(data), 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const sharedProps = {
        data,
        total,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Alert Severity Distribution</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
