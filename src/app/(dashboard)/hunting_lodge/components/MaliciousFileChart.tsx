'use client';

import type { MaliciousFile } from '@/features/dashboard_v2/types';

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
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Malicious File Distribution</h2>
            <div className="space-y-2 sm:space-y-3">
                {files.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.name}
                            className="flex items-center justify-between p-2 sm:p-3 rounded-lg transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="flex-1 min-w-0"> {/* 添加 min-width-0 防止文字溢出 */}
                                <div
                                    className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-none"
                                    title={item.name}
                                >
                                    {item.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    {percentage}% of total
                                </div>
                            </div>
                            <div
                                className="text-lg sm:text-xl font-bold ml-3 sm:ml-4 whitespace-nowrap"
                                style={{ color }}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
                Total Malicious Files: {total}
            </div>
        </div>
    );
}
