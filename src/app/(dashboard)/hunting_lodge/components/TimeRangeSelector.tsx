'use client';

import { useState } from 'react';

interface TimeRange {
    start_time: string;
    end_time: string;
}

interface Props {
    onChange: (range: TimeRange) => void;
}

const PRESET_RANGES = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Custom', value: 'custom' }
] as const;

export default function TimeRangeSelector({ onChange }: Props) {
    const [selectedRange, setSelectedRange] = useState<string>('24h');
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');

    const handleRangeChange = (range: string) => {
        setSelectedRange(range);

        if (range !== 'custom') {
            const end = new Date();
            let start = new Date();

            switch (range) {
                case '24h':
                    start.setHours(start.getHours() - 24);
                    break;
                case '7d':
                    start.setDate(start.getDate() - 7);
                    break;
                case '30d':
                    start.setDate(start.getDate() - 30);
                    break;
            }

            onChange({
                start_time: start.toISOString(),
                end_time: end.toISOString()
            });
        }
    };

    const handleCustomRangeChange = () => {
        if (customStart && customEnd) {
            onChange({
                start_time: new Date(customStart).toISOString(),
                end_time: new Date(customEnd).toISOString()
            });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2">
                    {PRESET_RANGES.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => handleRangeChange(value)}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedRange === value
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {selectedRange === 'custom' && (
                    <div className="flex gap-4 items-center">
                        <input
                            type="datetime-local"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="datetime-local"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <button
                            onClick={handleCustomRangeChange}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
