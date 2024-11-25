'use client'

import { MitreDisplayData } from '@/features/agents/types/agent';
import { ArrowUpRight } from 'lucide-react';

interface MitreListProps {
    mitres: MitreDisplayData[];
}

export default function MitreList({ mitres }: MitreListProps) {
    return (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Security Events</h2>
                <a
                    href="https://attack.mitre.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm"
                >
                    MITRE ATT&CK
                    <ArrowUpRight className="w-4 h-4" />
                </a>
            </div>

            <div className="divide-y divide-gray-200">
                {mitres.map((event, index) => (
                    <div
                        key={index}
                        className="p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                                    {event.count}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {event.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Detected Events
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {mitres.length === 0 && (
                    <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">No security events detected</p>
                    </div>
                )}
            </div>
        </div>
    );
}
