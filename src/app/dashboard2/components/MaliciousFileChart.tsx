'use client';

import type { MaliciousFile } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: MaliciousFile;
}

const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
];

export default function MaliciousFileChart({ data }: Props) {
    const files = data.content.malicious_file_barchart;
    const total = files.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Malicious File Distribution</h2>
            <div className="space-y-3">
                {files.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.name}
                            className="flex items-center justify-between p-3 rounded-lg transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="flex-1">
                                <div className="text-sm text-gray-600 truncate" title={item.name}>
                                    {item.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {percentage}% of total
                                </div>
                            </div>
                            <div
                                className="text-xl font-bold ml-4"
                                style={{ color }}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
                Total Malicious Files: {total}
            </div>
        </div>
    );
}
