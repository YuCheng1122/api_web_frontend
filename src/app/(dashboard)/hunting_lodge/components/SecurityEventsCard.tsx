'use client';

import { useRouter } from 'next/navigation';
import type { EventTable } from '@/features/dashboard_v2/types';

interface Props {
    data: EventTable;
}

export default function SecurityEventsCard({ data }: Props) {
    const router = useRouter();
    const events = data.content.event_table;
    const totalEvents = events.length;

    // Calculate severity counts
    const criticalEvents = events.filter(e => e.rule_level >= 10).length;
    const highEvents = events.filter(e => e.rule_level >= 7 && e.rule_level < 10).length;
    const mediumEvents = events.filter(e => e.rule_level >= 4 && e.rule_level < 7).length;

    const handleEventsClick = () => {
        router.push('/hunting_lodge/events');
    };

    const handleNetworkClick = () => {
        router.push('/hunting_lodge/network');
    };

    const handleThreatHuntingClick = () => {
        router.push('/hunting_lodge/threat-hunting');
    };

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Security Events</h2>
            <div className="mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-gray-600">Total Events</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalEvents}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Critical</div>
                    <div className="text-lg sm:text-xl font-bold text-red-600">
                        {criticalEvents}
                    </div>
                </div>
                <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">High</div>
                    <div className="text-lg sm:text-xl font-bold text-orange-600">
                        {highEvents}
                    </div>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-600">Medium</div>
                    <div className="text-lg sm:text-xl font-bold text-yellow-600">
                        {mediumEvents}
                    </div>
                </div>
            </div>
            {/* 在移動端改為垂直堆疊按鈕 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                    onClick={handleEventsClick}
                    className="text-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    <span>View Events</span>
                    <span className="ml-1 sm:ml-2">→</span>
                </button>
                <button
                    onClick={handleNetworkClick}
                    className="text-center text-xs sm:text-sm text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    <span>View Network</span>
                    <span className="ml-1 sm:ml-2">→</span>
                </button>
                <button
                    onClick={handleThreatHuntingClick}
                    className="text-center text-xs sm:text-sm text-violet-600 hover:text-violet-800 hover:bg-violet-50 py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                    <span>Threat Hunting</span>
                    <span className="ml-1 sm:ml-2">→</span>
                </button>
            </div>
        </div>
    );
}
