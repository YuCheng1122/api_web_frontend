'use client';

import { useState, useEffect } from 'react';
import type { AgentOS } from '../../../../../features/dashboard_v2/types';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface Props {
    data: AgentOS;
}

export default function AgentOSChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const osData = data.content.agent_os;
    const total = osData.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const sharedProps = {
        osData,
        total,
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Operating System Distribution</h2>
            {isMobile ? (
                <MobileView {...sharedProps} />
            ) : (
                <DesktopView {...sharedProps} />
            )}
        </div>
    );
}
