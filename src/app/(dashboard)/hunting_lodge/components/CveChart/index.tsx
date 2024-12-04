'use client';

import { useState, useEffect } from 'react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface Props {
    data: CveBarchart[];
}

export default function CveChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const total = data.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const sharedProps = {
        cveData: data,
        total,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">CVE 分析</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
