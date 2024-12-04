'use client';

import { useState, useEffect } from 'react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';
import { MobileView } from '@/app/(dashboard)/hunting_lodge/components/CveChart/MobileView';
import { DesktopView } from '@/app/(dashboard)/hunting_lodge/components/CveChart/DesktopView';

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
        <div className="w-full bg-white rounded-lg shadow-sm p-3">
            <h2 className="text-base font-semibold mb-3">CVE 分析</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
