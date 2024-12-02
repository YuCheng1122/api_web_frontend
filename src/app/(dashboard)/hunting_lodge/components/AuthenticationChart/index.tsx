'use client';

import { useState, useEffect } from 'react';
import type { Authentication } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface Props {
    data: Authentication;
}

export default function AuthenticationChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const tactics = data.content.authentication_piechart;
    const total = tactics.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const sharedProps = {
        tactics,
        total,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">身份驗證策略分佈</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
