'use client';

import { useRouter } from 'next/navigation';
import type { EventTable } from '@/features/dashboard2.0/types/generated';

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

    const handleClick = () => {
        router.push('/dashboard2/events');
    };

    return (
        <div
            className="w-full h-full bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={handleClick}
        >
            <h2 className="text-lg font-semibold mb-4">Security Events</h2>
            <div className="mb-4">
                <div className="text-sm text-gray-600">Total Events</div>
                <div className="text-3xl font-bold text-gray-900">{totalEvents}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">Critical</div>
                    <div className="text-xl font-bold text-red-600">
                        {criticalEvents}
                    </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-gray-600">High</div>
                    <div className="text-xl font-bold text-orange-600">
                        {highEvents}
                    </div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-gray-600">Medium</div>
                    <div className="text-xl font-bold text-yellow-600">
                        {mediumEvents}
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center text-sm text-blue-600 hover:text-blue-800">
                Click to view details →
            </div>
        </div>
    );
}
