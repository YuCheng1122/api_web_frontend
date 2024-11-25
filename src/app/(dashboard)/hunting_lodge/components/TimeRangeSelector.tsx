'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface TimeRange {
    start_time: string;
    end_time: string;
}

interface Props {
    onChange: (range: TimeRange) => void;
}

const PRESET_RANGES = [
    { label: 'Last 24 Hours', value: '24h', shortLabel: '24h' },
    { label: 'Last 7 Days', value: '7d', shortLabel: '7d' },
    { label: 'Last 30 Days', value: '30d', shortLabel: '30d' },
    { label: 'Custom', value: 'custom', shortLabel: 'Custom' }
] as const;

export default function TimeRangeSelector({ onChange }: Props) {
    const [selectedRange, setSelectedRange] = useState<string>('24h');
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleRangeChange = (range: string) => {
        setSelectedRange(range);
        setIsOpen(false);

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
            setIsOpen(false);
        }
    };

    const getCurrentRangeLabel = () => {
        const range = PRESET_RANGES.find(r => r.value === selectedRange);
        return isMobile ? range?.shortLabel : range?.label;
    };

    // Mobile View
    if (isMobile) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{getCurrentRangeLabel()}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50">
                        <div className="p-2 space-y-2">
                            {PRESET_RANGES.map(({ label, value }) => (
                                <button
                                    key={value}
                                    onClick={() => handleRangeChange(value)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedRange === value
                                            ? 'bg-blue-500 text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {selectedRange === 'custom' && (
                            <div className="border-t p-3 space-y-3">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-500">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-500">End Date</label>
                                    <input
                                        type="datetime-local"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomRangeChange}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Apply Custom Range
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Desktop View
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
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
